import type { RegisterBody, LoginBody} from "../schemas/auth.schema";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Wallet from "../models/wallet.model";

export const registerUser = async(userData: RegisterBody)=>{

    const existingUser = await User.findOne({
        email: userData.email
    });

    if(existingUser){
        throw new Error('User already exist');
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

        const [newWallet] = await Wallet.create([{
            owner: newUser._id
        }], {session});

        await session.commitTransaction();

        return {
        success: true,
        message: "Registration Successful",
        data: newUser
    };
        
    }catch(error){
        await session.abortTransaction();
        throw error;
    }finally{
        await session.endSession();
    }

    
}

export const loginUser = async(userData: LoginBody)=>{

    const user = await User.findOne({email: userData.email});

    if(!user){
        throw new Error("Invalid username or password");
    }

    const isPasswordCorrect = await bcrypt.compare(userData.password, user.password);

    if(!isPasswordCorrect){
        throw new Error("Invalid username or password");
    }

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn: '1d'});

    const {password, ...userDataWithoutPassword} = user.toObject();

    return {
        success: true,
        message: "Login successfully",        
        data: {
            token,
            user:userDataWithoutPassword
        }
    }
    
}