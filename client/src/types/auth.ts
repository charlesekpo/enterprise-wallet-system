export interface AuthUser {
    _id: string,
    role: "USER" | "ADMIN"
};

export interface LoginData {
    accessToken: string,
    user: AuthUser
};

export interface LoginResponse {
    success: boolean,
    message: string,
    data: LoginData
};