import type { AuthUser } from "../types/auth";
import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import {setApiAccessToken, setAuthTokenUpdater} from "../api/axios";
import {logoutUser, refreshAccessToken} from "../api/auth.api";
import { getProfile } from "../api/user.api";

// Auth context type
interface AuthContextType {
    accessToken: string | null;
    user: AuthUser | null;
    authLoading: boolean;

    setAccessToken: (token: string | null) => void;
    setUser: (user: AuthUser | null) => void;

    logout: () => Promise<void>;
}

// create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// provider props
interface AuthProviderProps{
    children: ReactNode
}

// auth provider
export function AuthProvider ({children}: AuthProviderProps){
    const[accessToken, setAccessToken] = useState<string | null>(null);
    const[user, setUser] = useState<AuthUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {

        const restoreSession = async () => {

            try {

                // Get new access token
                const response =
                    await refreshAccessToken();

                const { accessToken } =
                    response.data.data;

                // Update React
                setAccessToken(accessToken);

                // Immediately update Axios
                setApiAccessToken(accessToken);

                // Get current user
                const profileResponse =
                    await getProfile();

                const user =
                    profileResponse.data.data;

                // Update React user
                setUser(user);

            } catch (error) {

                setAccessToken(null);
                setUser(null);

            } finally {

                setAuthLoading(false);

            }
        };

        restoreSession();

    }, []);

    const logout = async () => {

        try {
            await logoutUser();
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    // React to Axios
    useEffect(()=>{
        setApiAccessToken(accessToken);
    },[accessToken]);

    // Axios to React
    useEffect(()=>{
        setAuthTokenUpdater(setAccessToken);
    },[]);

    return (<AuthContext.Provider
        value={{accessToken, user, authLoading, setAccessToken, setUser, logout}}
    >
       {children} 
    </AuthContext.Provider>);
};

// uesAuth hook
export function useAuth(){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth nust be used within the AuthProvider');
    }

    return context;
} 

