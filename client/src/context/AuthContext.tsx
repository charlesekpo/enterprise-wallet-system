import type { AuthUser } from "../types/auth";
import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import {setApiAccessToken, setAuthTokenUpdater} from "../api/axios";
import { logoutUser } from "../api/auth.api";

// Auth context type
interface AuthContextType {
    accessToken: string | null,
    user: AuthUser | null,
    setAccessToken: (token: string | null) => void,
    setUser: (user: AuthUser | null) => void,
    logout: ()=> void
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
        value={{accessToken, user, setAccessToken, setUser, logout}}
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

