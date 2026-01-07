import api from './api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    name: string;
    email?: string;
}

export interface UserData {
    id: number;
    username: string;
    name: string;
    email?: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: UserData;
    error?: string;
}

/**
 * Authentication Service
 * Handles all authentication-related API calls to Java backend
 */
export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth?action=register', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth?action=login', credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    },

    /**
     * Logout current user
     */
    async logout(): Promise<AuthResponse> {
        try {
            const response = await api.get('/auth?action=logout');
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Logout failed');
        }
    },

    /**
     * Check if user is authenticated (validate session)
     */
    async checkAuth(): Promise<AuthResponse> {
        try {
            const response = await api.get('/auth?action=check');
            return response.data;
        } catch (error: any) {
            // Not authenticated is not an error, return null data
            return {
                success: false,
                message: 'Not authenticated',
            };
        }
    },
};

export default authService;
