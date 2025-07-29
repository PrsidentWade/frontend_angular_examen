export interface LoginData {
    token(token: any): unknown;
    email: string;
    password: string;
}