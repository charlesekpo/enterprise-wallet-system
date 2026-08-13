import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {

    const { logout } = useAuth();

    return (
        <aside>

            <h2>Enterprise Wallet</h2>

            <nav>

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/wallet">
                    Wallet
                </Link>

                <Link to="/transactions">
                    Transactions
                </Link>

                <Link to="/deposit">
                    Deposit
                </Link>

                <Link to="/withdraw">
                    Withdraw
                </Link>

                <Link to="/transfer">
                    Transfer
                </Link>

            </nav>

            <button onClick={logout}>
                Logout
            </button>

        </aside>
    );
}

export default Sidebar;