import {useAuth} from "../context/AuthContext";
import {useEffect} from "react";
import {getWallet} from "../api/wallet.api";

function Dashboard(){

    const{user} = useAuth();

    useEffect(()=>{
        const showWallet = async()=>{
            try {
                const response = await getWallet();
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        showWallet();
    },[]);
    return (
        <>
        <h1>Dashboard page</h1>
            <h1>Welcome: {user?.role}</h1>
            <h1>Your ID is: {user?._id}</h1>
            
        </>
    )
};

export default Dashboard;