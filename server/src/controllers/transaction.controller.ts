import {Request, Response} from "express";
import {transactions} from "../services/transaction.service";

export const allTransactions = async(req: Request, res: Response)=>{
    // call the service and pass the userId
    const getTransactions = await transactions(req.user.id);
    res.status(200).json(getTransactions);
}