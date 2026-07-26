import {Request, Response} from "express";
import {getWallet} from "../services/wallet.service";
import {depositMoney, withdrawMoney, transferMoney} from "../services/wallet.service";
import type { DepositBody, WithdrawBody, TransferBody } from "../schemas/wallet.schema";

export const myWallet = async (req: Request, res: Response)=>{
    const wallet = await getWallet(req.user.id);

    res.status(200).json(wallet);
}

export const deposit = async(req: Request<{}, {}, DepositBody>, res: Response)=>{

    const makeDeposit = await depositMoney(req.user.id, req.body);

    res.status(200).json(makeDeposit);
};

export const withdraw = async(req: Request<{}, {}, WithdrawBody>, res: Response)=>{
    const makeWithdrawal = await withdrawMoney(req.user.id, req.body);
    res.status(200).json(makeWithdrawal);
};

export const transfer = async(req: Request<{}, {}, TransferBody>, res: Response)=>{
    const makeTransfer = await transferMoney(req.user.id, req.body);
    res.status(200).json(makeTransfer);
};
