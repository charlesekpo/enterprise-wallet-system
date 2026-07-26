import {Request, Response} from "express";
import {getWallet} from "../services/wallet.service";
import {depositMoney} from "../services/wallet.service";
import type { DepositBody } from "../schemas/wallet.schema";

export const myWallet = async (req: Request, res: Response)=>{
    const wallet = await getWallet(req.user.id);

    res.status(200).json(wallet);
}

export const deposit = async(req: Request<{}, {}, DepositBody>, res: Response)=>{

    const makeDeposit = await depositMoney(req.user.id, req.body);

    res.status(200).json(makeDeposit);
}
