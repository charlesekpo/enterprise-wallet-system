import {Request, Response, NextFunction} from "express";
import type {Role} from "../types/role.type";

const authorize = (...roles: Role[])=>{
    return(req: Request, res: Response, next: NextFunction)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            })
        }
        next();
    }
}

export default authorize;