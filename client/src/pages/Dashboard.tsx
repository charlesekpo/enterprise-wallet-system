import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWallet } from "../api/wallet.api";
import { getTransactions, type Transaction } from "../api/transaction.api";
import "./Dashboard.css";

interface Wallet {
    _id: string;
    owner: string;
    balance: number;
    currency: string;
    status: string;
}

function Dashboard() {

    const { user } = useAuth();

    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const [walletResponse, transactionResponse] =
                    await Promise.all([
                        getWallet(),
                        getTransactions({
                            page: 1,
                            limit: 5
                        })
                    ]);

                setWallet(walletResponse.data);
                setTransactions(transactionResponse.data.data);

            } catch (error: any) {

                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard."
                );

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                {error}
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">

                <div>
                    <h1>Welcome back!</h1>

                    <p>
                        Manage your wallet and transactions.
                    </p>
                </div>

            </div>

            {/* Wallet Balance */}

            <div className="balance-card">

                <div>
                    <p className="balance-label">
                        Available Balance
                    </p>

                    <h2>
                        {wallet?.currency}{" "}
                        {wallet?.balance.toLocaleString()}
                    </h2>
                </div>

                <div className="wallet-status">
                    {wallet?.status}
                </div>

            </div>

            {/* Quick Actions */}

            <div className="quick-actions">

                <Link
                    to="/deposit"
                    className="action-card"
                >
                    <span>+</span>
                    <strong>Deposit</strong>
                    <small>Add money to your wallet</small>
                </Link>

                <Link
                    to="/withdraw"
                    className="action-card"
                >
                    <span>−</span>
                    <strong>Withdraw</strong>
                    <small>Withdraw money from your wallet</small>
                </Link>

                <Link
                    to="/transfer"
                    className="action-card"
                >
                    <span>→</span>
                    <strong>Transfer</strong>
                    <small>Send money to another user</small>
                </Link>

            </div>

            {/* Recent Transactions */}

            <div className="recent-transactions">

                <div className="section-header">

                    <div>
                        <h2>Recent Transactions</h2>
                        <p>Your latest wallet activity</p>
                    </div>

                    <Link to="/transactions">
                        View all
                    </Link>

                </div>

                {transactions.length === 0 ? (

                    <div className="empty-transactions">
                        No transactions yet.
                    </div>

                ) : (

                    <div className="recent-transaction-list">

                        {transactions.map((transaction) => (

                            <Link
                                key={transaction._id}
                                to={`/transactions/${transaction.reference}`}
                                className="recent-transaction"
                            >

                                <div className="transaction-info">

                                    <strong>
                                        {transaction.type}
                                    </strong>

                                    <small>
                                        {transaction.description}
                                    </small>

                                </div>

                                <div className="transaction-amount">

                                    <strong>
                                        {transaction.type ===
                                        "DEPOSIT" ||
                                        transaction.type ===
                                        "TRANSFER_IN"
                                            ? "+"
                                            : "-"}
                                        {transaction.currency}{" "}
                                        {transaction.amount.toLocaleString()}
                                    </strong>

                                    <span
                                        className={`status-badge status-${transaction.status.toLowerCase()}`}
                                    >
                                        {transaction.status}
                                    </span>

                                </div>

                            </Link>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Dashboard;