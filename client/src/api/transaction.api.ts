import api from "./axios";

export type TransactionType =
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "TRANSFER_IN"
    | "TRANSFER_OUT";

export type TransactionStatus =
    | "SUCCESS"
    | "FAILED"
    | "PENDING"
    | "REVERSED";

export interface Transaction {
    _id: string;
    reference: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    balanceBefore: number;
    balanceAfter: number;
    currency: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    wallet: string;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalTransactions: number;
    totalPages: number;
    data: Transaction[];
}

export interface TransactionFilters {
    page?: number;
    limit?: number;
    type?: TransactionType;
    status?: TransactionStatus;
}

export const getTransactions = (filters: TransactionFilters = {}) => {

    return api.get<TransactionResponse>(
        "/api/transactions",
        {
            params: filters
        }
    );

};