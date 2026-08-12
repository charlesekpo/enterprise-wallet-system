import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

// Axio's current acces token
let accessToken: string | null = null;

//Tracks an ongoing refresh
let refreshPromise: Promise<string> | null = null;

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
    // successful response
    (response)=>{
        return response;
    },

    // error response
    async (error)=>{
        // if the error is not 401, we don't handle it here
        if(error.response?.status !== 401){
            throw error;
        }

        if(error.config?.url === '/auth/refresh-token'){
            throw error;
        }

        if(!refreshPromise){

            // Ask backend for new access token
            refreshPromise = api
            .post('/auth/refresh-token')
            .then((response)=>{

                // extract the new access token
                const newAccessToken = response.data.data.accessToken;

                // update Axios copy of the access token
                accessToken = newAccessToken;

                // also update React's copy of the access token
                if(updateAuthToken){
                updateAuthToken(newAccessToken);

                return newAccessToken;
        }

            }).catch((error)=>{
                accessToken = null;
                if(updateAuthToken){
                updateAuthToken(newAccessToken);
                }

                throw error
            })
            .finally(()=>{
                refreshPromise = null;
            });
        } 
        
        const newAccessToken = await refreshPromise;

        // get the request that originally failed
        const originalRequest = error.config;

        // replace the old token with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // now send the original request again
        return api(originalRequest);
    }
);

export default api;