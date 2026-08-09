import api from "./axios";

export const getWallet =()=>{
    return api.get('/api/wallet');
}