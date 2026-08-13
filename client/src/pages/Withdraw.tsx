import { useState } from "react";
import { withdrawMoney } from "../api/withdraw.api";
import "./Withdraw.css";

function Withdraw() {

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

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        setLoading(true);

        try {

            const response = await withdrawMoney(Number(amount));

            setMessage(response.data.message);
            setAmount("");

        } catch (error: any) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Withdrawal failed. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="transaction-page">

            <div className="transaction-card">

                <h1>Withdraw Money</h1>

                <p className="transaction-description">
                    Withdraw money from your wallet.
                </p>

                <form onSubmit={handleSubmit}>

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
                        {loading ? "Processing..." : "Withdraw Money"}
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

export default Withdraw;