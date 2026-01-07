export interface Transaction {
  id: string | number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  transactionDate: string; // Backend sends transactionDate
  userId?: number;
}

export interface Budget {
  id?: number;
  category: string;
  budgetLimit: number; // Backend sends budgetLimit
  spent: number;
  userId?: number;
}

export interface SavingsGoal {
  id: string | number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  userId?: number;
}

export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Makanan & Minuman', icon: 'Coffee' },
  { value: 'transport', label: 'Transportasi', icon: 'Bus' },
  { value: 'education', label: 'Pendidikan', icon: 'Book' },
  { value: 'entertainment', label: 'Hiburan', icon: 'Film' },
  { value: 'shopping', label: 'Belanja', icon: 'ShoppingCart' },
  { value: 'bills', label: 'Tagihan', icon: 'Receipt' },
  { value: 'health', label: 'Kesehatan', icon: 'Smartphone' },
  { value: 'savings', label: '💰 Tabungan', icon: 'PiggyBank' },
  { value: 'other', label: 'Lainnya', icon: 'Wallet' },
];

export const INCOME_CATEGORIES = [
  { value: 'allowance', label: 'Uang Saku', icon: 'Wallet' },
  { value: 'parttime', label: 'Kerja Part-time', icon: 'DollarSign' },
  { value: 'scholarship', label: 'Beasiswa', icon: 'Book' },
  { value: 'gift', label: 'Hadiah', icon: 'PiggyBank' },
  { value: 'other', label: 'Lainnya', icon: 'Plus' },
];