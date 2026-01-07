import api from './api';

// ===== TYPES =====

export interface Transaction {
    id?: number;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    date: string; // ISO date string
    transactionDate?: string; // Backend uses this field name
}

export interface Budget {
    id?: number;
    category: string;
    budgetLimit: number;
    spent: number;
}

export interface SavingsGoal {
    id?: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    isCompleted?: boolean;
}

export interface DashboardData {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    totalSavings: number;
    recentTransactions: Transaction[];
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// ===== DATA SERVICE =====

/**
 * Data Service
 * Handles all CRUD operations for transactions, budgets, and savings goals
 */
export const dataService = {

    // ===== DASHBOARD =====

    /**
     * Get dashboard statistics
     */
    async getDashboard(): Promise<DashboardData> {
        try {
            const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.error || 'Failed to fetch dashboard data');
            }
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch dashboard');
        }
    },

    // ===== TRANSACTIONS =====

    /**
     * Get all transactions
     */
    async getTransactions(): Promise<Transaction[]> {
        try {
            const response = await api.get<ApiResponse<Transaction[]>>('/transactions');
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to fetch transactions');
            }
            return response.data.data || [];
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch transactions');
        }
    },

    /**
     * Get single transaction by ID
     */
    async getTransaction(id: number): Promise<Transaction> {
        try {
            const response = await api.get<ApiResponse<Transaction>>(`/transactions?id=${id}`);
            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.error || 'Transaction not found');
            }
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch transaction');
        }
    },

    /**
     * Create new transaction
     */
    async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        try {
            // Backend expects transactionDate field
            const payload = {
                ...transaction,
                transactionDate: transaction.date,
            };

            const response = await api.post<ApiResponse<Transaction>>('/transactions', payload);
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to create transaction');
            }
            return response.data.data || transaction as Transaction;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create transaction');
        }
    },

    /**
     * Delete transaction
     */
    async deleteTransaction(id: number): Promise<void> {
        try {
            const response = await api.delete<ApiResponse<null>>(`/transactions?id=${id}`);
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to delete transaction');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete transaction');
        }
    },

    // ===== BUDGETS =====

    /**
     * Get all budgets
     */
    async getBudgets(): Promise<Budget[]> {
        try {
            const response = await api.get<ApiResponse<Budget[]>>('/budgets');
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to fetch budgets');
            }
            return response.data.data || [];
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch budgets');
        }
    },

    /**
     * Create new budget
     */
    async createBudget(budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget> {
        try {
            const response = await api.post<ApiResponse<Budget>>('/budgets', budget);
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to create budget');
            }
            return response.data.data || { ...budget, spent: 0 } as Budget;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create budget');
        }
    },

    /**
     * Delete budget
     */
    async deleteBudget(id: number): Promise<void> {
        try {
            const response = await api.delete<ApiResponse<null>>(`/budgets?id=${id}`);
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to delete budget');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete budget');
        }
    },

    // ===== SAVINGS GOALS =====

    /**
     * Get all savings goals
     */
    async getSavingsGoals(): Promise<SavingsGoal[]> {
        try {
            const response = await api.get<ApiResponse<SavingsGoal[]>>('/savings');
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to fetch savings goals');
            }
            return response.data.data || [];
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch savings goals');
        }
    },

    /**
     * Get total savings amount
     */
    async getTotalSavings(): Promise<number> {
        try {
            const response = await api.get<ApiResponse<{ totalSavings: number }>>('/savings?action=total');
            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.error || 'Failed to fetch total savings');
            }
            return response.data.data.totalSavings;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch total savings');
        }
    },

    /**
     * Create new savings goal
     */
    async createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'isCompleted'>): Promise<SavingsGoal> {
        try {
            const response = await api.post<ApiResponse<SavingsGoal>>('/savings', goal);
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to create savings goal');
            }
            return response.data.data || { ...goal, currentAmount: 0, isCompleted: false } as SavingsGoal;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create savings goal');
        }
    },

    /**
     * Add money to savings goal
     */
    async addToSavings(goalId: number, amount: number): Promise<void> {
        try {
            const response = await api.post<ApiResponse<null>>('/savings?action=add_money', {
                goalId,
                amount,
            });
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to add money to savings');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Failed to add money to savings');
        }
    },

    /**
     * Delete savings goal
     */
    async deleteSavingsGoal(id: number): Promise<void> {
        try {
            const response = await api.delete<ApiResponse<null>>(`/savings?id=${id}`);
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to delete savings goal');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete savings goal');
        }
    },
};

export default dataService;
