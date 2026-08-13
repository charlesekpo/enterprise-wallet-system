import api from "./axios";

export interface TransferData {
    senderWallet: {
        _id: string;
        owner: string;
        balance: number;
        currency: string;
        status: string;
    };
    recipient: string;
}

export interface TransferResponse {
    success: boolean;
    message: string;
    data: TransferData;
}

export interface TransferRequest {
    recipientEmail: string;
    amount: number;
}

export const transferMoney = (transferData: TransferRequest) => {
    return api.post<TransferResponse>(
        "/api/wallet/transfer",
        transferData
    );
};