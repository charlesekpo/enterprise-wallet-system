import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {

    const { logout } = useAuth();

    return (
        <aside className="sidebar">

            <h2 className="sidebar-logo">
                Enterprise Wallet
            </h2>

            <nav className="sidebar-nav">

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

            <button
                className="logout-button"
                onClick={logout}
            >
                Logout
            </button>

        </aside>
    );
}

export default Sidebar;