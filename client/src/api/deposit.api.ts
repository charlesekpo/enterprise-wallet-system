import api from "./axios";

export interface DepositData {
    _id: string;
    owner: string;
    balance: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface DepositResponse {
    success: boolean;
    message: string;
    data: DepositData;
}

export const depositMoney = (amount: number) => {
    return api.post<DepositResponse>("/api/wallet/deposit", {
        amount
    });
};