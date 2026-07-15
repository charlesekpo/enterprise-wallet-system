import {Request, Response} from "express";
import { RegisterBody, LoginBody} from "../schemas/auth.schema";
import {registerUser, loginUser} from "../services/auth.service";

export const register =async (req: Request<{}, {}, RegisterBody>, res: Response)=>{

    const result = await registerUser(req.body);

    return res.status(201).json(result);  

};

export const login = async(req: Request<{}, {}, LoginBody>, res:Response)=>{
    const result = await loginUser(req.body);
    return res.status(200).json(result);
};