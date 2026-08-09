import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

let accessToken: string | null = null;

export const setApiAccessToken = (token: string | null)=>{
    accessToken = token;
}

api.interceptors.request.use((config)=>{
    
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default api;