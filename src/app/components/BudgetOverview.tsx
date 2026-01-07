import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Budget, Transaction, EXPENSE_CATEGORIES } from '../types';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export function BudgetOverview({ budgets, transactions }: BudgetOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryLabel = (categoryValue: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  // Calculate spent amount for each budget this month
  const getBudgetsWithSpent = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return budgets.map(budget => {
      const spent = transactions
        .filter(t => {
          const date = new Date(t.transactionDate);
          return (
            t.type === 'expense' &&
            t.category === budget.category &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = budget.budgetLimit - spent;
      const percentage = (spent / budget.budgetLimit) * 100;

      return {
        ...budget,
        spent,
        remaining,
        percentage
      };
    });
  };

  const budgetsWithSpent = getBudgetsWithSpent();

  if (budgetsWithSpent.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-purple-600" />
            Sisa Budget Bulan Ini
          </CardTitle>
          <CardDescription>Pantau sisa budget untuk setiap kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada budget yang diatur.</p>
            <p className="text-sm mt-1">Buat budget di tab Budget untuk mulai memantau pengeluaran Anda!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-purple-600" />
          Sisa Budget Bulan Ini
        </CardTitle>
        <CardDescription>Pantau sisa budget untuk setiap kategori</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetsWithSpent.map((budget) => {
            const isOverBudget = budget.percentage >= 100;
            const isNearLimit = budget.percentage >= 80 && budget.percentage < 100;
            const isHealthy = budget.percentage < 80;

            return (
              <div
                key={budget.category}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${isOverBudget
                    ? 'bg-red-50 border-red-300'
                    : isNearLimit
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-white border-green-300'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {getCategoryLabel(budget.category)}
                      </h3>
                      {isOverBudget ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : isHealthy ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Budget: {formatCurrency(budget.budgetLimit)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress
                    value={Math.min(budget.percentage, 100)}
                    className={`h-2 ${isOverBudget
                        ? '[&>div]:bg-red-500'
                        : isNearLimit
                          ? '[&>div]:bg-yellow-500'
                          : '[&>div]:bg-green-500'
                      }`}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-medium ${isOverBudget
                          ? 'text-red-700'
                          : isNearLimit
                            ? 'text-yellow-700'
                            : 'text-green-700'
                        }`}>
                        Terpakai: {formatCurrency(budget.spent)}
                      </p>
                      <p className={`font-bold ${isOverBudget
                          ? 'text-red-600'
                          : isNearLimit
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                        {isOverBudget ? 'Melebihi' : 'Sisa'}: {formatCurrency(Math.abs(budget.remaining))}
                      </p>
                    </div>
                    <div className={`text-right ${isOverBudget
                        ? 'text-red-600'
                        : isNearLimit
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                      <p className="text-2xl font-bold">
                        {budget.percentage.toFixed(0)}%
                      </p>
                      <p className="text-xs font-medium">
                        {isOverBudget ? 'Over Budget!' : isNearLimit ? 'Hampir Habis' : 'Aman'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
