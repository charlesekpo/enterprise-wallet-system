import { useEffect, useState } from "react";
import {
    getTransactions,
    type Transaction,
    type TransactionType,
    type TransactionStatus
} from "../api/transaction.api";

import "./Transactions.css";

function Transactions() {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [type, setType] = useState<TransactionType | "">("");
    const [status, setStatus] = useState<TransactionStatus | "">("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const limit = 5;

    const loadTransactions = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await getTransactions({
                page,
                limit,
                type: type || undefined,
                status: status || undefined
            });

            setTransactions(response.data.data);
            setTotalPages(response.data.totalPages);

        } catch (error: any) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Unable to load transactions."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadTransactions();

    }, [page, type, status]);

    const handleTypeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setType(
            event.target.value as TransactionType | ""
        );

        setPage(1);
    };

    const handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setStatus(
            event.target.value as TransactionStatus | ""
        );

        setPage(1);
    };

    return (
        <div className="transactions-page">

            <div className="transactions-header">

                <div>
                    <h1>Transactions</h1>

                    <p>
                        View your wallet transaction history.
                    </p>
                </div>

            </div>

            <div className="transaction-filters">

                <div>

                    <label htmlFor="type">
                        Type
                    </label>

                    <select
                        id="type"
                        value={type}
                        onChange={handleTypeChange}
                    >

                        <option value="">
                            All Types
                        </option>

                        <option value="DEPOSIT">
                            Deposit
                        </option>

                        <option value="WITHDRAWAL">
                            Withdrawal
                        </option>

                        <option value="TRANSFER_IN">
                            Transfer In
                        </option>

                        <option value="TRANSFER_OUT">
                            Transfer Out
                        </option>

                    </select>

                </div>

                <div>

                    <label htmlFor="status">
                        Status
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={handleStatusChange}
                    >

                        <option value="">
                            All Statuses
                        </option>

                        <option value="SUCCESS">
                            Success
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="REVERSED">
                            Reversed
                        </option>

                    </select>

                </div>

            </div>

            {loading && (
                <div className="transactions-message">
                    Loading transactions...
                </div>
            )}

            {error && (
                <div className="transactions-error">
                    {error}
                </div>
            )}

            {!loading && !error && transactions.length === 0 && (
                <div className="transactions-message">
                    No transactions found.
                </div>
            )}

            {!loading && transactions.length > 0 && (

                <div className="transactions-table-wrapper">

                    <table className="transactions-table">

                        <thead>

                            <tr>
                                <th>Reference</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Balance After</th>
                                <th>Date</th>
                            </tr>

                        </thead>

                        <tbody>

                            {transactions.map((transaction) => (

                                <tr key={transaction._id}>

                                    <td>
                                        {transaction.reference}
                                    </td>

                                    <td>
                                        {transaction.type}
                                    </td>

                                    <td>
                                        {transaction.currency}{" "}
                                        {transaction.amount.toLocaleString()}
                                    </td>

                                    <td>
                                        <span
                                            className={`status-badge status-${transaction.status.toLowerCase()}`}
                                        >
                                            {transaction.status}
                                        </span>
                                    </td>

                                    <td>
                                        {transaction.currency}{" "}
                                        {transaction.balanceAfter.toLocaleString()}
                                    </td>

                                    <td>
                                        {new Date(
                                            transaction.createdAt
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            {!loading && totalPages > 1 && (

                <div className="pagination">

                    <button
                        disabled={page === 1}
                        onClick={() =>
                            setPage((current) => current - 1)
                        }
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() =>
                            setPage((current) => current + 1)
                        }
                    >
                        Next
                    </button>

                </div>

            )}

        </div>
    );
}

export default Transactions;