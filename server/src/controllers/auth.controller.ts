import {Request, Response} from "express";
import { RegisterBody, LoginBody, ChangePasswordBody, ForgotPasswordBody} from "../schemas/auth.schema";
import {registerUser, loginUser, changeMyPassword, forgotPassword} from "../services/auth.service";

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response)=>{

    const result = await registerUser(req.body);

    return res.status(201).json(result);  

};

export const login = async(req: Request<{}, {}, LoginBody>, res:Response)=>{
    const result = await loginUser(req.body);
    return res.status(200).json(result);
};

export const changePassword = async(req: Request<{}, {}, ChangePasswordBody>, res: Response)=>{
    const callChangePassword = await changeMyPassword(req.user.id, req.body);
    res.status(200).json(callChangePassword);
};

export const forgetMyPassword = async(req: Request<{}, {}, ForgotPasswordBody>, res: Response)=>{
    const createToken = await forgotPassword(req.body);
    res.status(200).json(createToken);
}