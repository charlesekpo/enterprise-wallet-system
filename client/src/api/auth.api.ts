import type { LoginResponse } from "../types/auth";
import api from "./axios";

type LoginCredentials = {
    email: string,
    password: string
};

export const loginUser = (credentials: LoginCredentials) =>{
    return api.post<LoginResponse>('/auth/login', credentials);
};