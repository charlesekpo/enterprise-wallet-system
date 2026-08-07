import api from "./axios";

type LoginCredentials = {
    email: string,
    password: string
};

export const loginUser = (credentials: LoginCredentials) =>{
    return api.post('/auth/login', credentials);
}