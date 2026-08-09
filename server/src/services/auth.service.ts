import type { RegisterBody, LoginBody, ChangePasswordBody, ForgotPasswordBody, ResetPasswordBody, RefreshTokenBody} from "../schemas/auth.schema";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Wallet from "../models/wallet.model";
import AppError from "../utils/AppError";
import PasswordReset from "../models/password-reset.model";
import crypto from "crypto";
import generateRefreshToken from "../utils/generateRefreshToken";
import RefreshToken from "../models/refreshToken.model";

export const registerUser = async(userData: RegisterBody)=>{

    const existingUser = await User.findOne({
        email: userData.email
    });

    if(existingUser){
        throw new AppError('User already exist', 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUserData = {
        ...userData,
        password: hashedPassword
    };

    const session = await mongoose.startSession();

    session.startTransaction();

    try{
        const [newUser] = await User.create([newUserData], {session});

        await Wallet.create([{
            owner: newUser._id
        }], {session});

        await session.commitTransaction();

        const userWithoutPassword = {
            _id: newUser._id,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        }

        return {
        success: true,
        message: "Registration Successful",
        data: userWithoutPassword
    };
        
    }catch(error){
        await session.abortTransaction();
        throw error;
    }finally{
        await session.endSession();
    }
   
}

export const loginUser = async(userData: LoginBody, userAgent: string, ipAddress: string)=>{

    const user = await User.findOne({email: userData.email});

    if(!user){
        throw new AppError("Invalid username or password", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(userData.password, user.password);

    if(!isPasswordCorrect){
        throw new AppError("Invalid username or password", 401);
    }

    const accessToken = await jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET!, {expiresIn: '15m'});

    const refreshToken = generateRefreshToken();

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent,
        ipAddress
    });

    const {password, ...userDataWithoutPassword} = user.toObject();

    return {
        success: true,
        message: "Login successfully",        
        data: {
            accessToken,
            refreshToken,
            user:userDataWithoutPassword
        }
    }
    
}

export const changeMyPassword = async(userId: string, changePasswordData: ChangePasswordBody)=>{
    // to get user from req.user.id
    const user = await User.findById(userId);

    if(!user){
        throw new AppError('User not found', 404);
    }

    const comparePassword = await bcrypt.compare(changePasswordData.currentPassword, user.password);

    if(!comparePassword){
        throw new AppError('Invalid password', 400);
    }

    const samePassword = await bcrypt.compare(changePasswordData.newPassword, user.password);

    if(samePassword){
        throw new AppError('New password cannot be the same as current password', 400);
    }

    const hashedPassword = await bcrypt.hash(changePasswordData.newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return {
        success: true,
        message: "Password changed successfully"
    };
}

export const forgotPassword = async(forgotPasswordData: ForgotPasswordBody)=>{
    const user = await User.findOne({email: forgotPasswordData.email});
    if(!user){

        //to avoid attacker guessing, user enumeration.
        return {
            success: true,
            message: "If an account exists, a reset link has been sent."
        };
    };

    const existingToken = await PasswordReset.findOne({ user: user._id});
    if(existingToken && existingToken.expiresAt > new Date()){
        // still valid token
        return existingToken.token;
    };

    await PasswordReset.deleteMany({ user: user._id});

    const token = crypto.randomBytes(32).toString('hex');

    await PasswordReset.create({
        user: user._id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    });

    // for now, simply returning token in response. Should be sent to email
    return {
        success: true,
        message: "Token generated",
        token
    };
 
}

export const resetPassword = async(resetPasswordData: ResetPasswordBody)=>{
    // find the token in your token table where the request body = the token
    const resetToken = await PasswordReset.findOne({ token: resetPasswordData.token});
    if(!resetToken){
        throw new AppError('Invalid token', 401);
    };
    // check if the token is expired
    if(resetToken.expiresAt < new Date()){
        throw new AppError('Token is expired', 401);
    }
    // find the user from the db
    const user = await User.findById(resetToken.user);
    if(!user){
        throw new AppError('User not found', 404);
    };

    // prevent same password
    const samePassword = await bcrypt.compare(resetPasswordData.newPassword, user.password);
    if(samePassword){
        return {
            success: true,
            message: "Same password as previous"
        };
    };

    // hash the password
    const hashedPassword = await bcrypt.hash(resetPasswordData.newPassword, 10);
  
    // save new password
    user.password = hashedPassword;

    await user.save();
    // remember to always delete the reset token

    const deleteToken = await PasswordReset.deleteOne({_id: resetToken._id});

    // return message
    return {
        success: true,
        message: "Password updated successfully"
    }
}

export const refreshAccessToken = async(refreshToken: string)=>{
    
    const refToken = await RefreshToken.findOne({
        token: refreshToken
    });

    if(!refToken){
        throw new AppError('Unauthorized', 401);
    };

    // check if the refresh token is expired
    if(refToken.expiresAt < new Date()){
        await refToken.deleteOne();
        throw new AppError('Unauthorized', 401);
    };

    const user = await User.findById(refToken.user);

    if(!user){
        await refToken.deleteOne();
        throw new AppError('User not found', 404);
    };

    const accessToken = jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET!,
        {expiresIn: '15m'}
    );

    return {
        success: true,
        message: 'Access token refreshed',
        data: {
            accessToken: accessToken
        }
    }
    
}

export const logout = async(refreshTokenData: RefreshTokenBody)=>{

    const refToken = await RefreshToken.findOne({token: refreshTokenData.refreshToken});

    if(!refToken){
        
        // idempotency logout. since refresh token is missing, then it is logout
        return{
        success: true,
        message: "Logged out successfully"
    }
    }

    await refToken.deleteOne();

    return{
        success: true,
        message: "Logged out successfully"
    }
}