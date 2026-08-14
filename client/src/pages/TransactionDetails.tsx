import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getTransactionByReference,
    type Transaction
} from "../api/transaction.api";

import "./TransactionDetails.css";

function TransactionDetails() {

    const { reference } = useParams();
    const navigate = useNavigate();

    const [transaction, setTransaction] =
        useState<Transaction | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadTransaction = async () => {

            if (!reference) {
                setError("Transaction reference is missing.");
                setLoading(false);
                return;
            }

            try {

                const response =
                    await getTransactionByReference(reference);

                setTransaction(response.data.data);

            } catch (error: any) {

                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load transaction."
                );

            } finally {

                setLoading(false);

            }
        };

        loadTransaction();

    }, [reference]);

    if (loading) {
        return (
            <div className="transaction-details-page">
                <p>Loading transaction...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transaction-details-page">

                <div className="transaction-details-error">
                    {error}
                </div>

                <button
                    onClick={() => navigate("/transactions")}
                >
                    Back to Transactions
                </button>

            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="transaction-details-page">
                <p>Transaction not found.</p>
            </div>
        );
    }

    return (
        <div className="transaction-details-page">

            <div className="transaction-details-header">

                <div>

                    <h1>Transaction Details</h1>

                    <p>
                        View complete information about this transaction.
                    </p>

                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/transactions")}
                >
                    ← Back
                </button>

            </div>

            <div className="transaction-details-card">

                <div className="transaction-detail-row">
                    <span>Reference</span>
                    <strong>{transaction.reference}</strong>
                </div>

                <div className="transaction-detail-row">
                    <span>Type</span>
                    <strong>{transaction.type}</strong>
                </div>

                <div className="transaction-detail-row">
                    <span>Amount</span>
                    <strong>
                        {transaction.currency}{" "}
                        {transaction.amount.toLocaleString()}
                    </strong>
                </div>

                <div className="transaction-detail-row">
                    <span>Status</span>

                    <span
                        className={`status-badge status-${transaction.status.toLowerCase()}`}
                    >
                        {transaction.status}
                    </span>
                </div>

                <div className="transaction-detail-row">
                    <span>Balance Before</span>
                    <strong>
                        {transaction.currency}{" "}
                        {transaction.balanceBefore.toLocaleString()}
                    </strong>
                </div>

                <div className="transaction-detail-row">
                    <span>Balance After</span>
                    <strong>
                        {transaction.currency}{" "}
                        {transaction.balanceAfter.toLocaleString()}
                    </strong>
                </div>

                <div className="transaction-detail-row">
                    <span>Description</span>
                    <strong>
                        {transaction.description}
                    </strong>
                </div>

                <div className="transaction-detail-row">
                    <span>Date</span>
                    <strong>
                        {new Date(
                            transaction.createdAt
                        ).toLocaleString()}
                    </strong>
                </div>

            </div>

        </div>
    );
}

export default TransactionDetails;