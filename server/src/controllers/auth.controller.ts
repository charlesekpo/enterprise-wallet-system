import {Request, Response} from "express";

export const register =(req: Request, res: Response)=>{

        res.json({
            success: true,
            message: "Registration successful",
            data: req.body
        });  

};

export const login =(req: Request, res: Response)=>{
    res.send('Login Controller created');
};