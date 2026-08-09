import {useAuth} from "../context/AuthContext";

function Dashboard(){
    const{accessToken, user} = useAuth();
    return (
        <>
        <h1>Dashboard page</h1>
            <h1>Welcome: {user?.role}</h1>
            <h1>Your ID is: {user?._id}</h1>
            <h1>Access Token: {accessToken}</h1>
        </>
    )
};

export default Dashboard;