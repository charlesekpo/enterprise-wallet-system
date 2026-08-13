import { useEffect, useState } from "react";
import { getWallet } from "../api/wallet.api";
import "./Wallet.css";

interface WalletData {
    _id: string;
    owner: string;
    balance: number;
    currency: string;
    status: string;
}

function Wallet() {

    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadWallet = async () => {

            try {
                const response = await getWallet();
                setWallet(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }

        };

        loadWallet();

    }, []);

    if (loading) {
        return <p>Loading wallet...</p>;
    }

    if (!wallet) {
        return <p>Unable to load wallet.</p>;
    }

    return (
        <div className="wallet-page">

            <h1>My Wallet</h1>

            <div className="balance-card">

                <p className="balance-label">
                    Available Balance
                </p>

                <h2>
                    {wallet.currency} {wallet.balance.toLocaleString()}
                </h2>

                <p>
                    Wallet status: {wallet.status}
                </p>

            </div>

            <div className="wallet-info">

                <h2>Wallet Information</h2>

                <p>
                    <strong>Wallet ID:</strong> {wallet._id}
                </p>

                <p>
                    <strong>Owner:</strong> {wallet.owner}
                </p>

                <p>
                    <strong>Currency:</strong> {wallet.currency}
                </p>

                <p>
                    <strong>Status:</strong> {wallet.status}
                </p>

            </div>

        </div>
    );
}

export default Wallet;