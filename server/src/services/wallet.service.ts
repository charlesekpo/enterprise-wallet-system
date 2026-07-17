import Wallet from "../models/wallet.model";
export const getWallet = async (userId: string)=>{
    const walletDetails = await Wallet.findOne({
        owner: userId
    });

    if(!walletDetails){
        throw new Error("Wallet not found");
    }

    return walletDetails;
}