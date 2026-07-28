import Wallet from "../models/wallet.model";
import AppError from "../utils/AppError";
import Transaction from "../models/transaction.model";

export const transactions = async(userId: string, page: number, limit: number)=>{
    const transactionWallet = await Wallet.findOne({owner: userId});
    if(!transactionWallet){
        throw new AppError('Wallet not found', 404);
    }

    const skip = (page - 1) * limit;

    // get the number of transactions
    const totalTransactions = await Transaction.countDocuments({
        wallet: transactionWallet._id
    });

    // simple math to get the pages, based on the limit selected
    const paginationPages = Math.ceil(totalTransactions / limit);

    // get all transactions
    const allTransactions = await Transaction.find({
        wallet: transactionWallet._id
    }).sort({createdAt: -1}).skip(skip).limit(limit);

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