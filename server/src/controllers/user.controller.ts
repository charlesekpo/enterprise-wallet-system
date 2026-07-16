import {Request, Response} from "express";

const getProfile = (req: Request, res: Response)=>{

    res.status(200).json({
        success: true,
        message: 'Profile successfully retrieved',
        data: req.user
    });
}

export default getProfile;