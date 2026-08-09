import {Request, Response} from "express";
import AppError from "../utils/AppError";;
import { RegisterBody, LoginBody, ChangePasswordBody, ForgotPasswordBody, ResetPasswordBody, RefreshTokenBody} from "../schemas/auth.schema";
import {registerUser, loginUser, changeMyPassword, forgotPassword, resetPassword, refreshAccessToken, logout} from "../services/auth.service";

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response)=>{

    const result = await registerUser(req.body);

    return res.status(201).json(result);  

};

export const login = async(req: Request<{}, {}, LoginBody>, res:Response)=>{
    const result = await loginUser(req.body, req.get('user-agent') || '', req.ip || '');
    const{data, ...rest} = result;
    const{refreshToken, ...loginData} = data;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });
    return res.status(200).json({
        ...rest,
        data: loginData
    });
};

export const changePassword = async(req: Request<{}, {}, ChangePasswordBody>, res: Response)=>{
    const callChangePassword = await changeMyPassword(req.user.id, req.body);
    res.status(200).json(callChangePassword);
};

export const forgetMyPassword = async(req: Request<{}, {}, ForgotPasswordBody>, res: Response)=>{
    const createToken = await forgotPassword(req.body);
    res.status(200).json(createToken);
}

export const resetMyPassword = async(req: Request<{}, {}, ResetPasswordBody>, res: Response)=>{
    const resetPass = await resetPassword(req.body);
    res.status(200).json(resetPass);
}

export const refreshMyToken = async(req: Request, res: Response)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError('Unauthorized', 401);
    }

    const refToken = await refreshAccessToken(req.cookies.refreshToken);
    res.status(200).json(refToken);
}

export const myLogout = async(req: Request<{}, {}, RefreshTokenBody>, res: Response)=>{
    const logoutReq = await logout(req.body);
    res.status(200).json(logoutReq);
}