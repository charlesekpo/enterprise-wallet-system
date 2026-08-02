import type {Role} from "./role.type";

export interface AuthPayload {
    id: string,
    role: Role
}