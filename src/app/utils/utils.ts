// Type for the user object
export interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export const setToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const removeToken = (): void => {
    localStorage.removeItem('authToken');
};

export const setUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const removeUser = (): void => {
    localStorage.removeItem('user');
};

export const isLoggedIn = (): boolean => {
    return !!getToken();
};

export const clearAll = (): void => {
    localStorage.clear();
};
