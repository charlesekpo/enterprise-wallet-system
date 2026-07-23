import {Request, Response, NextFunction} from "express";
import AppError from "../utils/AppError";

const handleError =(error: Error, req: Request, res: Response, next: NextFunction)=>{
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: error.message
    });
};

export default handleError;