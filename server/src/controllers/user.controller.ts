import {Request, Response} from "express";
import myProfile from "../services/user.service";

const getProfile = async(req: Request, res: Response)=>{

    const profile = await myProfile(req.user.id);

    res.status(200).json(profile);
}

export default getProfile;