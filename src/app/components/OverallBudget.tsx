import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Budget, Transaction, EXPENSE_CATEGORIES } from '../types';
import { Wallet, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface OverallBudgetProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export function OverallBudget({ budgets, transactions }: OverallBudgetProps) {
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

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate total budget
  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetLimit, 0);

  // Calculate spent per category
  const getBudgetBreakdown = () => {
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
        percentage,
      };
    });
  };

  const budgetBreakdown = getBudgetBreakdown();
  const totalSpent = budgetBreakdown.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = (totalSpent / totalBudget) * 100;

  const isOverBudget = totalRemaining < 0;
  const isNearLimit = overallPercentage >= 80 && !isOverBudget;

  return (
    <div className="space-y-6">
      {/* Overall Budget Summary */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 text-white">
                <Wallet className="h-6 w-6" />
                Budget Keseluruhan Bulan Ini
              </CardTitle>
              <CardDescription className="text-blue-100 mt-2">
                Total budget untuk semua kategori
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Pengeluaran
                </p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>

            {/* Remaining Budget */}
            <div className={`rounded-xl p-6 ${isOverBudget
                ? 'bg-red-500/30 border-2 border-red-300'
                : isNearLimit
                  ? 'bg-yellow-500/30 border-2 border-yellow-300'
                  : 'bg-green-500/30 border-2 border-green-300'
              }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isOverBudget ? (
                    <AlertCircle className="h-5 w-5 text-white" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-white" />
                  )}
                  <h3 className="text-xl font-bold">
                    {isOverBudget ? 'Budget Terlampaui!' : 'Sisa Budget'}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {formatCurrency(Math.abs(totalRemaining))}
                  </p>
                  <p className="text-sm text-blue-100">
                    {isOverBudget ? 'Over budget' : 'Masih tersedia'}
                  </p>
                </div>
              </div>

              <Progress
                value={Math.min(overallPercentage, 100)}
                className={`h-3 bg-white/30 ${isOverBudget
                    ? '[&>div]:bg-red-200'
                    : isNearLimit
                      ? '[&>div]:bg-yellow-200'
                      : '[&>div]:bg-green-200'
                  }`}
              />

              <div className="flex items-center justify-between mt-3 text-sm">
                <span>Terpakai: {overallPercentage.toFixed(1)}%</span>
                <span>
                  {isOverBudget
                    ? '⚠️ Kurangi pengeluaran!'
                    : isNearLimit
                      ? '⚡ Hampir habis, hati-hati!'
                      : '✅ Budget masih aman'}
                </span>
              </div>
            </div>

            {/* Budget Allocation */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Alokasi Budget per Kategori
              </h4>
              <div className="space-y-2">
                {budgetBreakdown.map((budget) => {
                  const categoryPercentage = (budget.budgetLimit / totalBudget) * 100;
                  return (
                    <div key={budget.category} className="flex items-center justify-between text-sm">
                      <span className="flex-1">{getCategoryLabel(budget.category)}</span>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={categoryPercentage}
                          className="w-24 h-2 bg-white/20"
                        />
                        <span className="w-20 text-right font-medium">
                          {formatCurrency(budget.budgetLimit)}
                        </span>
                        <span className="w-12 text-right text-blue-100">
                          {categoryPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-purple-600" />
            Rincian Penggunaan Budget
          </CardTitle>
          <CardDescription>Lihat detail pengeluaran per kategori bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          {budgetBreakdown.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada budget yang diatur. Buat budget terlebih dahulu!
            </div>
          ) : (
            <div className="space-y-4">
              {budgetBreakdown.map((budget) => {
                const isOver = budget.percentage >= 100;
                const isNear = budget.percentage >= 80 && budget.percentage < 100;

                return (
                  <div
                    key={budget.category}
                    className={`p-4 rounded-xl border-2 transition-all ${isOver
                        ? 'bg-red-50 border-red-300'
                        : isNear
                          ? 'bg-yellow-50 border-yellow-300'
                          : 'bg-green-50 border-green-300'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getCategoryLabel(budget.category)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Budget: {formatCurrency(budget.budgetLimit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${isOver ? 'text-red-600' : isNear ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                          {budget.percentage.toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">terpakai</p>
                      </div>
                    </div>

                    <Progress
                      value={Math.min(budget.percentage, 100)}
                      className={`h-2 mb-3 ${isOver
                          ? '[&>div]:bg-red-500'
                          : isNear
                            ? '[&>div]:bg-yellow-500'
                            : '[&>div]:bg-green-500'
                        }`}
                    />

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">Terpakai</p>
                        <p className="font-semibold">{formatCurrency(budget.spent)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">
                          {isOver ? 'Kelebihan' : 'Sisa'}
                        </p>
                        <p className={`font-semibold ${isOver ? 'text-red-600' : 'text-green-600'
                          }`}>
                          {formatCurrency(Math.abs(budget.remaining))}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}