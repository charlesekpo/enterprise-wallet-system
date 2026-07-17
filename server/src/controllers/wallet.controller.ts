import {Request, Response} from "express";
import {getWallet} from "../services/wallet.service";

const myWallet = async (req: Request, res: Response)=>{
    const wallet = await getWallet(req.user.id);

    res.status(200).json({
        success: true,
        message: "Wallet retrieved successfully",
        data: wallet
    });
}

export default myWallet;