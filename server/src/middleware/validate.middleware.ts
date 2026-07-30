import {ZodSchema} from "zod";
import {Request, Response, NextFunction} from "express";

type validateTarget = 'body' | 'query' | 'params';
const validate = (schema: ZodSchema, target: validateTarget = 'body')=>(req: Request, res: Response, next: NextFunction) =>{
    const result = schema.safeParse(req[target]);
    if(!result.success){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.issues
        });
    }

    next();
};

export default validate;