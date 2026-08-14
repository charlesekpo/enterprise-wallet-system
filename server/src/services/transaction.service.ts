import Wallet from "../models/wallet.model";
import AppError from "../utils/AppError";
import Transaction from "../models/transaction.model";
import mongoose from "mongoose";

export const transactions = async(userId: string, page: number, limit: number, type?: string, status?: string)=>{
    const transactionWallet = await Wallet.findOne({owner: userId});
    if(!transactionWallet){
        throw new AppError('Wallet not found', 404);
    }

    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {
        wallet: transactionWallet._id
    };

    const statusCheck = [
        'SUCCESS',
        'FAILED',
        'PENDING',
        'REVERSED'
    ];

    const typeCheck = [
        'DEPOSIT',
        'WITHDRAWAL',
        'TRANSFER_IN',
        'TRANSFER_OUT'
    ];

    if(type && !typeCheck.includes(type)){
        throw new AppError("Invalid query type", 400);
    }

    if(type){
        query.type = type;
    }

    if(status && !statusCheck.includes(status)){
        throw new AppError("Invalid query status", 400);
    }

    if(status){
        query.status = status;
    }

    const totalTransactions =
        await Transaction.countDocuments(query);

    const paginationPages =
        Math.ceil(totalTransactions / limit);

    const allTransactions = await Transaction
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
            success: true,
            message: "Transactions retrieved successfully",
            page: page,
            limit: limit,
            totalTransactions: totalTransactions,
            totalPages: paginationPages,
            data: allTransactions
        };
}

export const getTransactionByReference = async(userId: string, reference: string) => {

    const myWallet = await Wallet.findOne({owner: userId});

    if(!myWallet){
        throw new AppError('Wallet not found', 404);
    };

    const trx = await Transaction.findOne({wallet: myWallet._id, reference: reference})
    .populate({path: "wallet", select: "currency owner", 
        populate:{ path:"owner", select: "email"}});

    if(!trx){
        throw new AppError('Transaction not found', 404);
    }

    return {
        success: true,
        message: "Transaction retrieved successfully",
        data: trx
    };
}