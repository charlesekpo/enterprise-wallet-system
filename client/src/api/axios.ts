import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

// Axio's current acces token
let accessToken: string | null = null;

// React -> Axios
// React calls this whenever its accessToken changes
export const setApiAccessToken = (token: string | null)=>{
    accessToken = token;
}

// now Axios -> React
// This variable will eventually contain React's setAccessToken function
let updateAuthToken:((token: string)=>void) | null = null;

// React gives Axios the setAccessToken
export const setAuthTokenUpdater = (updater: (token: string) => void ) =>{
    updateAuthToken = updater
}

// Request interceptor
api.interceptors.request.use((config)=>{
    
    // if Axios currently has an access token, attach it to the request
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// Response interceptor
api.interceptors.response.use(

    // Successful response
    (response) => {
        return response;
    },

    // Failed response
    async (error) => {

        const originalRequest = error.config;

        // Only handle 401
        if (error.response?.status !== 401) {
            throw error;
        }

        // Do NOT refresh authentication endpoints
        if (
            originalRequest.url === "/auth/login" ||
            originalRequest.url === "/auth/refresh-token" ||
            originalRequest.url === "/auth/logout"
        ) {
            throw error;
        }

        // Ask backend for a new access token
        const response =
            await api.post("/auth/refresh-token");

        const newAccessToken =
            response.data.data.accessToken;

        // Update Axios token
        accessToken = newAccessToken;

        // Update React token
        if (updateAuthToken) {
            updateAuthToken(newAccessToken);
        }

        // Update original request
        originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
    }
);

export default api;