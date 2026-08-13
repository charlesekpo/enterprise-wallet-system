import api from "./axios";

export interface WithdrawData {
    _id: string;
    owner: string;
    balance: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface WithdrawResponse {
    success: boolean;
    message: string;
    data: WithdrawData;
}

export const withdrawMoney = (amount: number) => {
    return api.post<WithdrawResponse>("/api/wallet/withdraw", {
        amount
    });
};