export interface RegisterData {
    name: string;
    email: string;
    role: 'admin' | 'users';
    password: string;

}
