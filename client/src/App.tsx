import {Routes, Route} from  "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Wallet from "./pages/Wallet";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";

function App() {
    return (
        <Routes>

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>

                <Route element={<Layout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/wallet"
                        element={<Wallet />}
                    />

                    <Route
                        path="/deposit"
                        element={<Deposit />}
                    />

                    <Route
                        path="/withdraw"
                        element={<Withdraw />}
                    />

                    <Route
                        path="/transfer"
                        element={<Transfer />}
                    />

                </Route>

            </Route>

        </Routes>
    );
}

export default App;