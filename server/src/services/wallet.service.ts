import Wallet from "../models/wallet.model";
import type { DepositBody, WithdrawBody } from "../schemas/wallet.schema";
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

export const withdrawMoney = async(userId: string, withdrawData: WithdrawBody)=>{
    const session = await mongoose.startSession();
    await session.startTransaction();
    try{

        // find the wallet first
        const wallet = await Wallet.findOne({
            owner: userId
        }).session(session);

        // check is no wallet found
        if(!wallet){
            throw new AppError("Wallet not found", 404);
        };

        // check wallet status before balance
        if(wallet.status !== 'ACTIVE'){
            throw new AppError("Wallet is not active", 409);
        };

        // for transaction history ledger
        const balanceBefore = wallet.balance;

        // check current balance
        if(withdrawData.amount > balanceBefore){
            throw new AppError("Insufficient balance", 400);
        };

        // deduct the amount to be withdrawn
        wallet.balance -= withdrawData.amount;

        // save the wallet inside the session
        await wallet.save({session});

        // get a reference using prefix, say WDL for withdrawal
        const reference = generateReference("WDL");

        // create a transaction inside the same session
        await Transaction.create([{
            reference,
            amount: withdrawData.amount,
            wallet: wallet._id,
            status: "SUCCESS",
            type: "WITHDRAWAL",
            balanceBefore, 
            balanceAfter: wallet.balance,
            currency: wallet.currency,
            description: "Withdrawal made"
        }], {session});

        //proceed to commit the entire process
        await session.commitTransaction();

        // return plain data to controller
        return {
            success: true,
            message: "Withdrawal Successful",
            data: wallet
        }

    }catch(error){
        // if there is any error during the processes above, simply abort all
        await session.abortTransaction();
        throw error
    }finally{
        // end the session
        await session.endSession();
    }

}