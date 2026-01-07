import { Transaction, Budget, SavingsGoal } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finmate_transactions',
  BUDGETS: 'finmate_budgets',
  SAVINGS_GOALS: 'finmate_savings_goals',
};

export const storageService = {
  // Transactions
  getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  
  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  
  // Budgets
  getBudgets(): Budget[] {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return data ? JSON.parse(data) : [];
  },
  
  saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },
  
  // Savings Goals
  getSavingsGoals(): SavingsGoal[] {
    const data = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
    return data ? JSON.parse(data) : [];
  },
  
  saveSavingsGoals(goals: SavingsGoal[]): void {
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  },
};
