import type { AuthUser } from "../types/auth";
import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import {setApiAccessToken} from "../api/axios";

interface AuthContextType {
    accessToken: string | null,
    user: AuthUser | null,
    setAccessToken: (token: string | null) => void,
    setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps{
    children: ReactNode
}

export function AuthProvider ({children}: AuthProviderProps){
    const[accessToken, setAccessToken] = useState<string | null>(null);
    const[user, setUser] = useState<AuthUser | null>(null);

    useEffect(()=>{
        setApiAccessToken(accessToken);
    },[accessToken]);

    return (<AuthContext.Provider
        value={{accessToken, user, setAccessToken, setUser}}
    >
       {children} 
    </AuthContext.Provider>);
};

export function useAuth(){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth nust be used within the AuthProvider');
    }

    return context;
} 

