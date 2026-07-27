import Wallet from "../models/wallet.model";
import type { DepositBody, WithdrawBody, TransferBody } from "../schemas/wallet.schema";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model";
import {generateReference} from "../utils/reference";
import User from "../models/user.model";
import {createTransactionRecord} from "../utils/createTransaction";

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

        await createTransactionRecord({
            referencePrefix: "DEP",
            amount: depositData.amount,
            wallet: wallet._id,
            type: "DEPOSIT",
            balanceBefore,
            balanceAfter: wallet.balance,
            currency: wallet.currency,
            description: "Wallet Deposit",
            session
        });

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
      
        await createTransactionRecord({
            referencePrefix: 'WDL',
                amount: withdrawData.amount,
                wallet: wallet._id,
                type: "WITHDRAWAL",
                balanceBefore,
                balanceAfter: wallet.balance,
                currency: wallet.currency,
                description: "Withdrawal made",
                session
        });

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

export const transferMoney = async(userId: string, transferData: TransferBody)=>{
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        // 1. find the sender
        const sender = await User.findById(userId).session(session);
        if(!sender){
            throw new AppError("Sender not found", 404);
        }

        // 2. Find sender wallet
        const senderWallet = await Wallet.findOne({
            owner: userId
        }).session(session);

        if(!senderWallet){
            throw new AppError("Sending wallet not found", 404);
        };

        // 3. Find recipient user
        const recipient = await User.findOne({
            email: transferData.recipientEmail
        }).session(session);

        if(!recipient){
            throw new AppError("User not found", 404);
        };

        // 4. Prevent self-transfer
        if(userId === recipient._id.toString()){
            throw new AppError("Self transfer is not allowed", 409);
        }

        // 5. Find recipient wallet
        const recipientWallet = await Wallet.findOne({
            owner: recipient._id
        }).session(session);

        if(!recipientWallet){
            throw new AppError("Recipient wallet not found", 404);
        }

        // 6. Check both wallets are ACTIVE
        if(senderWallet.status !== 'ACTIVE'){
            throw new AppError("Sender wallet is not active", 400);
        };

        if(recipientWallet.status !== 'ACTIVE'){
            throw new AppError("Recipient wallet is not active", 400);
        };

        // 7. Check sufficient balance
        const senderBalanceBefore = senderWallet.balance;
        const recipientBalanceBefore = recipientWallet.balance;

        if(transferData.amount > senderBalanceBefore){
            throw new AppError("Insufficient funds", 400);
        };

        // 8. Debit sender
        senderWallet.balance -= transferData.amount;

        // 9. Credit recipient
        recipientWallet.balance += transferData.amount;

        // 10. Save both wallets
        await senderWallet.save({session});
        await recipientWallet.save({session});

        // 11. Create sender transaction
        await createTransactionRecord({
            referencePrefix: 'TRO',
                amount: transferData.amount,
                wallet: senderWallet._id,
                type: "TRANSFER_OUT",
                balanceBefore: senderBalanceBefore,
                balanceAfter: senderWallet.balance,
                currency: senderWallet.currency,
                description: `Sent money to ${transferData.recipientEmail}`,
                session
        });

        // 12. Create recipient transaction
      
        await createTransactionRecord({
            referencePrefix: 'TRI',
                amount: transferData.amount,
                wallet: recipientWallet._id,
                type: "TRANSFER_IN",
                balanceBefore: recipientBalanceBefore,
                balanceAfter: recipientWallet.balance,
                currency: recipientWallet.currency,
                description: `Received money from ${sender.email}`,
                session
        });

        // 13. Commit transaction
        await session.commitTransaction();

        // 14. Return success
        return {
            success: true,
            message: "Transfer successful",
            data: {senderWallet, recipient: recipient.email}
        }

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }finally{
        await session.endSession();
    }
}