import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import type { AuthPayload } from "../types/auth.type";

const authenticate = (req: Request, res: Response, next: NextFunction)=>{

    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return res.status(401).json({
            success: false,
            message: "Header is missing"
        });
    };

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token is missing in the header"
        });
    };

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

        req.user = decoded;

        next();

    } catch{
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

export default authenticate;