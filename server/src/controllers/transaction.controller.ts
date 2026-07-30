import {Request, Response} from "express";
import {transactions, getTransactionByReference} from "../services/transaction.service";
import {TrasactionParams} from "../schemas/transaction.schema";

export const allTransactions = async(req: Request, res: Response)=>{
    
    let page = Number(req.query.page) || 1;

    let limit = Number(req.query.limit) || 5;

    const type = req.query.type as string || undefined;
    const status = req.query.status as string || undefined;

    // call the service and pass the userId
    const getTransactions = await transactions(req.user.id, page, limit, type, status);
    res.status(200).json(getTransactions);
}

export const transactionByRef = async(req: Request<TrasactionParams>, res: Response)=>{
    const getTrxByRef = await getTransactionByReference(req.user.id, req.params.reference);

    res.status(200).json(getTrxByRef);
}