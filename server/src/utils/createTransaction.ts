import mongoose from "mongoose";
import Transaction from "../models/transaction.model";
import {generateReference} from "./reference";

interface CreateTransactionData {
    referencePrefix: string,
    amount: number,
    wallet: mongoose.Types.ObjectId,
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER_IN" | "TRANSFER_OUT",
    balanceBefore: number,
    balanceAfter: number,
    currency: "NGN" | "USD",
    description: string,
    session: mongoose.ClientSession

}

export const createTransactionRecord = async(data: CreateTransactionData)=>{
    await Transaction.create([{
        wallet: data.wallet._id,
        status: "SUCCESS",
        balanceBefore: data.balanceBefore,
        balanceAfter: data.balanceAfter,
        currency: data.currency,
        description: data.description,
        amount: data.amount,
        reference: generateReference(data.referencePrefix),
        type: data.type
    }],{session: data.session});
}