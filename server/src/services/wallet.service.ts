import Wallet from "../models/wallet.model";
import AppError from "../utils/AppError";

export const getWallet = async (userId: string)=>{
    const walletDetails = await Wallet.findOne({
        owner: userId
    });

    if(!walletDetails){
        throw new AppError("Wallet not found", 404);
    }

    return walletDetails;
}