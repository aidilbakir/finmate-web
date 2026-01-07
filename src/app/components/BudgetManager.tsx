import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Budget, Transaction, EXPENSE_CATEGORIES } from '../types';
import { AlertCircle, Plus, TrendingDown, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onUpdateBudgets: (budgets: Budget[]) => void;
}

export function BudgetManager({ budgets, transactions, onUpdateBudgets }: BudgetManagerProps) {
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [limit, setLimit] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomCategory(true);
      setCategory('');
    } else {
      setShowCustomCategory(false);
      setCategory(value);
      setCustomCategory('');
    }
  };

  // Calculate spent amount for each budget
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

      return { ...budget, spent };
    });
  };

  const budgetsWithSpent = getBudgetsWithSpent();

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = showCustomCategory ? customCategory : category;

    if (!finalCategory || !limit) {
      toast.error('Mohon lengkapi semua field! 📝');
      return;
    }

    const numLimit = parseFloat(limit);
    if (isNaN(numLimit) || numLimit <= 0) {
      toast.error('Limit harus berupa angka positif! 🔢');
      return;
    }

    // Check if budget already exists
    if (budgets.some(b => b.category === finalCategory)) {
      toast.error('Budget untuk kategori ini sudah ada! 😅');
      return;
    }

    const newBudget: Budget = {
      category: finalCategory,
      budgetLimit: numLimit,
      spent: 0,
    };

    onUpdateBudgets([...budgets, newBudget]);
    setCategory('');
    setCustomCategory('');
    setShowCustomCategory(false);
    setLimit('');
    toast.success('💰 Budget berhasil ditambahkan!');
  };

  const handleRemoveBudget = (category: string, categoryLabel: string) => {
    const budgetToDelete = budgets.find(b => b.category === category);

    if (budgetToDelete) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const spent = transactions
        .filter(t => {
          const date = new Date(t.transactionDate);
          return (
            t.type === 'expense' &&
            t.category === category &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const confirm = window.confirm(
        `Hapus budget "${categoryLabel}"?\n\n` +
        `Budget: ${formatCurrency(budgetToDelete.budgetLimit)}\n` +
        `Terpakai: ${formatCurrency(spent)}\n\n` +
        `Transaksi pengeluaran kategori ini tidak akan dihapus, hanya budget limitnya saja.`
      );

      if (!confirm) return;
    }

    onUpdateBudgets(budgets.filter(b => b.category !== category));
    toast.success('🗑️ Budget berhasil dihapus!', {
      description: `Budget "${categoryLabel}" telah dihapus.`
    });
  };

  const getCategoryLabel = (categoryValue: string) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Atur Budget Bulanan
          </CardTitle>
          <CardDescription>Tetapkan batas pengeluaran untuk setiap kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Kategori</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="budget-category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem
                      key={cat.value}
                      value={cat.value}
                      disabled={budgets.some(b => b.category === cat.value)}
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" disabled={showCustomCategory}>
                    Kategori Lainnya
                  </SelectItem>
                </SelectContent>
              </Select>
              {showCustomCategory && (
                <Input
                  id="custom-budget-category"
                  type="text"
                  placeholder="Masukkan kategori baru"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-limit">Limit Budget (Rp)</Label>
              <Input
                id="budget-limit"
                type="number"
                placeholder="0"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Budget
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Budget Aktif
          </CardTitle>
          <CardDescription>Pantau pengeluaran Anda bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          {budgetsWithSpent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada budget. Mulai atur budget Anda!
            </div>
          ) : (
            <div className="space-y-4">
              {budgetsWithSpent.map((budget) => {
                const percentage = (budget.spent / budget.budgetLimit) * 100;
                const isOverBudget = percentage >= 100;
                const isNearLimit = percentage >= 80 && percentage < 100;

                return (
                  <div key={budget.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{getCategoryLabel(budget.category)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.budgetLimit)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                          {percentage.toFixed(0)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBudget(budget.category, getCategoryLabel(budget.category))}
                          className="hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Hapus budget"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-2"
                    />
                    {isOverBudget && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Budget telah terlampaui! Kurangi pengeluaran untuk kategori ini.
                        </AlertDescription>
                      </Alert>
                    )}
                    {isNearLimit && !isOverBudget && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Mendekati limit budget. Pertimbangkan untuk berhemat.
                        </AlertDescription>
                      </Alert>
                    )}
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