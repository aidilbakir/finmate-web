import axios from 'axios';

// Backend Java API base URL
const API_BASE_URL = 'http://localhost:8080/FinMate/api';

// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session cookies
    timeout: 10000, // 10 second timeout
});

// Request interceptor (untuk logging atau token management di masa depan)
api.interceptors.request.use(
    (config) => {
        // Log requests in development
        if (import.meta.env.MODE === 'development') {
            console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor (untuk handle errors globally)
api.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.MODE === 'development') {
            console.log(`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    (error) => {
        // Log errors
        if (import.meta.env.MODE === 'development') {
            console.error(`🔴 API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
        }

        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - possibly session expired
                console.warn('⚠️ Unauthorized - Session may have expired');
                // Could trigger logout here if needed
            } else if (status === 404) {
                console.warn('⚠️ Resource not found');
            } else if (status === 500) {
                console.error('❌ Server error');
            }

            // Return error message from backend
            return Promise.reject({
                message: data?.error || data?.message || 'An error occurred',
                status,
                data,
            });
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'No response from server. Is the backend running?',
                originalError: error,
            });
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'An error occurred',
                originalError: error,
            });
        }
    }
);

export default api;

// --- Transaction Service ---
export const transactionService = {
    getAll: async () => {
        const response = await api.get('/transactions');
        return response.data.data; // Assuming BaseServlet wraps in { status: "success", data: [...] }
    },
    create: async (transaction: any) => {
        const response = await api.post('/transactions', transaction);
        return response.data.data;
    },
    delete: async (id: string | number) => {
        const response = await api.delete(`/transactions?id=${id}`);
        return response.data;
    }
};

// --- Budget Service ---
export const budgetService = {
    getAll: async () => {
        const response = await api.get('/budgets');
        return response.data.data;
    },
    create: async (budget: any) => {
        const response = await api.post('/budgets', budget);
        return response.data.data;
    },
    delete: async (id: string | number) => {
        const response = await api.delete(`/budgets?id=${id}`);
        return response.data;
    }
};

// --- Savings Service ---
export const savingsService = {
    getAll: async () => {
        const response = await api.get('/savings');
        return response.data.data;
    },
    create: async (goal: any) => {
        const response = await api.post('/savings', goal);
        return response.data.data;
    },
    delete: async (id: string | number) => {
        const response = await api.delete(`/savings?id=${id}`);
        return response.data;
    },
    addMoney: async (goalId: string | number, amount: number) => {
        const response = await api.post(`/savings?action=add_money`, { goalId, amount });
        return response.data.data;
    }
};
