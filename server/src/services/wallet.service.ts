import Wallet from "../models/wallet.model";
import type { DepositBody } from "../schemas/wallet.schema";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model";
import {generateReference} from "../utils/reference";

export const getWallet = async (userId: string)=>{
    const walletDetails = await Wallet.findOne({
        owner: userId
    });

    if(!walletDetails){
        throw new AppError("Wallet not found", 404);
    }

    return walletDetails;
}

export const depositMoney = async(userId: string, depositData: DepositBody) => {
    
    const session = await mongoose.startSession();
    
    await session.startTransaction();
    
    try{
        
        const wallet = await Wallet.findOne({
            owner: userId
        }).session(session);

        if(!wallet){
            throw new AppError('Wallet not found', 404);
        };

        const balanceBefore  = wallet.balance;

        wallet.balance +=  depositData.amount;

        await wallet.save({session});

        const reference = generateReference("DEP");

        await Transaction.create([{
            reference,
            wallet: wallet._id,
            status: "SUCCESS",
            type: "DEPOSIT",
            amount: depositData.amount,
            balanceBefore,
            balanceAfter: wallet.balance,
            currency: wallet.currency,
            description: "Wallet Deposit"
        }], {session}); 

        await session.commitTransaction();

        return {
            success: true,
            message: "Deposit Successful",
            data: wallet
        }

    }catch(error){
        await session.abortTransaction();
        throw error
    }finally{
        await session.endSession();
    }

}