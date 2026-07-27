import Wallet from "../models/wallet.model";
import AppError from "../utils/AppError";
import Transaction from "../models/transaction.model";

export const transactions = async(userId: string)=>{
    const transactionWallet = await Wallet.findOne({owner: userId});
    if(!transactionWallet){
        throw new AppError('Wallet not found', 404);
    }

    const allTransactions = await Transaction.find({
        wallet: transactionWallet._id
    }).sort({createdAt: -1});

    if(allTransactions.length === 0){
        return {
            success: true,
            message: "No transaction yet",
            data: allTransactions
        };
    }

    return {
            success: true,
            message: "Transactions retrieved successfully",
            data: allTransactions
        };
}