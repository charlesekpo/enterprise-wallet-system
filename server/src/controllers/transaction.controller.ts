import {Request, Response} from "express";
import {transactions} from "../services/transaction.service";

export const allTransactions = async(req: Request, res: Response)=>{
    
    let page = Number(req.query.page) || 1;

    let limit = Number(req.query.limit) || 5;

    page = Math.min(page, 100);
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    limit = Math.min(limit, 100);

    const type = req.query.type as string || undefined;
    const status = req.query.status as string || undefined;

    // call the service and pass the userId
    const getTransactions = await transactions(req.user.id, page, limit, type, status);
    res.status(200).json(getTransactions);
}