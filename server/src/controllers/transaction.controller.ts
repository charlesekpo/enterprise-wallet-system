import {Request, Response} from "express";
import {transactions} from "../services/transaction.service";

export const allTransactions = async(req: Request, res: Response)=>{
    
    let page = Number(req.query.page) || 1;

    let limit = Number(req.query.limit) || 5;

    page = Math.min(page, 100);
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    limit = Math.min(limit, 100);

    // call the service and pass the userId
    const getTransactions = await transactions(req.user.id, page, limit);
    res.status(200).json(getTransactions);
}