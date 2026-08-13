import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {

    const { user } = useAuth();

    console.log("ProtectedRoute user:", user);

    if (!user) {
        console.log("No user — redirecting to login");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;