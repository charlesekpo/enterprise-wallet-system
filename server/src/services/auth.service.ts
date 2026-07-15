import type { RegisterBody, LoginBody} from "../schemas/auth.schema";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const newUser = await User.create(newUserData);

    return {
        success: true,
        message: "Registration Successful",
        data: newUser
    };
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