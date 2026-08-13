import { useState } from "react";
import { transferMoney } from "../api/transfer.api";
import "./Transfer.css";

function Transfer() {

    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (!recipientEmail) {
            setError("Please enter the recipient's email.");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        setLoading(true);

        try {

            const response = await transferMoney({
                recipientEmail,
                amount: Number(amount)
            });

            setMessage(response.data.message);

            setRecipientEmail("");
            setAmount("");

        } catch (error: any) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Transfer failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="transaction-page">

            <div className="transaction-card">

                <h1>Transfer Money</h1>

                <p className="transaction-description">
                    Send money securely to another Enterprise Wallet user.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="recipientEmail">
                            Recipient Email
                        </label>

                        <input
                            id="recipientEmail"
                            type="email"
                            placeholder="Enter recipient email"
                            value={recipientEmail}
                            onChange={(event) =>
                                setRecipientEmail(event.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="amount">
                            Amount
                        </label>

                        <div className="amount-input">

                            <span>₦</span>

                            <input
                                id="amount"
                                type="number"
                                min="1"
                                placeholder="0.00"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(event.target.value)
                                }
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="transaction-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Transfer Money"
                        }
                    </button>

                </form>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

            </div>

        </div>
    );
}

export default Transfer;