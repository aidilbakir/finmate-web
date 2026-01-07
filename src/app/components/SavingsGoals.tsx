import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { SavingsGoal, Budget, Transaction } from '../types';
import { Target, Plus, Trash2, TrendingUp, Calendar, Coins, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  budgets: Budget[];
  transactions: Transaction[];
  onUpdateGoals: (goals: SavingsGoal[]) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function SavingsGoals({ goals, budgets, transactions, onUpdateGoals, onAddTransaction }: SavingsGoalsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [addAmount, setAddAmount] = useState<{ [key: string]: string }>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDailySavingSuggestion = (goal: SavingsGoal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysLeft = getDaysRemaining(goal.deadline);
    
    if (daysLeft <= 0 || remaining <= 0) return 0;
    
    return Math.ceil(remaining / daysLeft);
  };

  const getTotalSavings = () => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  };

  const getTotalBalance = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return totalIncome - totalExpense;
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !targetAmount || !deadline) {
      toast.error('Mohon lengkapi semua field! 📝');
      return;
    }

    const numAmount = parseFloat(targetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Target harus berupa angka positif! 🔢');
      return;
    }

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name,
      targetAmount: numAmount,
      currentAmount: 0,
      deadline,
    };

    onUpdateGoals([...goals, newGoal]);
    setName('');
    setTargetAmount('');
    setDeadline('');
    setIsDialogOpen(false);
    
    toast.success('🎯 Target tabungan berhasil ditambahkan!', {
      description: `Yuk nabung ${formatCurrency(getDailySavingSuggestion(newGoal))} per hari! 💪`
    });
  };

  const handleAddToGoal = (goalId: string) => {
    const amount = parseFloat(addAmount[goalId] || '0');
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Masukkan jumlah yang valid! 🔢');
      return;
    }

    const currentBalance = getTotalBalance();
    
    if (amount > currentBalance) {
      toast.error(`Saldo tidak cukup! 😢`, {
        description: `Saldo kamu: ${formatCurrency(currentBalance)}. Kamu coba nabung ${formatCurrency(amount)}.`
      });
      return;
    }

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    // Create savings transaction first
    onAddTransaction({
      type: 'expense',
      amount,
      category: 'savings',
      description: `Nabung: ${goal.name}`,
      date: new Date().toISOString().split('T')[0],
    });

    // Update goal amount
    const updatedGoals = goals.map(g =>
      g.id === goalId
        ? { ...g, currentAmount: g.currentAmount + amount }
        : g
    );

    onUpdateGoals(updatedGoals);
    setAddAmount({ ...addAmount, [goalId]: '' });
    
    const updatedGoal = updatedGoals.find(g => g.id === goalId);
    if (updatedGoal) {
      const percentage = (updatedGoal.currentAmount / updatedGoal.targetAmount) * 100;
      if (percentage >= 100) {
        toast.success(`🎉 Selamat! Target "${updatedGoal.name}" tercapai!`, {
          description: 'Kamu hebat! Time to celebrate! 🥳'
        });
      } else {
        const newBalance = currentBalance - amount;
        toast.success(`💰 Berhasil menabung ${formatCurrency(amount)}!`, {
          description: `Saldo tersisa: ${formatCurrency(newBalance)} • Transaksi tercatat di riwayat`
        });
      }
    }
  };

  const handleRemoveGoal = (id: string, name: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal && goal.currentAmount > 0) {
      const confirm = window.confirm(
        `Hapus target "${name}"? Tabungan ${formatCurrency(goal.currentAmount)} akan dikembalikan ke budget.`
      );
      if (!confirm) return;
    }
    
    onUpdateGoals(goals.filter(g => g.id !== id));
    toast.success('Target tabungan dihapus! ✓');
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBalance = getTotalBalance();
  const totalSavings = getTotalSavings();

  return (
    <div className="space-y-4">
      {/* Budget Overview for Savings */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-6 w-6" />
            Total Tabungan
          </CardTitle>
          <CardDescription className="text-green-100">
            Kelola tabungan dengan bijak untuk mencapai targetmu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-center">
            <p className="text-sm text-green-100 mb-2">Total Uang yang Sudah Ditabung</p>
            <p className="text-4xl font-bold">{formatCurrency(totalSavings)}</p>
            <p className="text-xs text-green-100 mt-2">dari semua target tabungan</p>
          </div>

          {totalBalance <= 0 && (
            <div className="mt-4 bg-red-500/30 border-2 border-red-300 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Saldo tidak cukup!</p>
                <p className="text-green-100">Tidak bisa menabung lagi. Tambah pemasukan atau kurangi pengeluaran dulu ya! 😊</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Savings Suggestions */}
      {goals.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Calendar className="h-5 w-5" />
              Saran Nabung Per Hari
            </CardTitle>
            <CardDescription>
              Rekomendasi jumlah nabung harian untuk mencapai target tepat waktu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goals.filter(g => {
                const percentage = (g.currentAmount / g.targetAmount) * 100;
                return percentage < 100;
              }).map((goal) => {
                const dailySuggestion = getDailySavingSuggestion(goal);
                const daysRemaining = getDaysRemaining(goal.deadline);
                const remaining = goal.targetAmount - goal.currentAmount;
                
                return (
                  <div key={goal.id} className="p-4 bg-white rounded-xl border-2 border-purple-200 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Sisa: {formatCurrency(remaining)} • {daysRemaining} hari lagi
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                        <p className="text-xs text-purple-700 font-medium mb-1">💰 Nabung per hari</p>
                        <p className="text-xl font-bold text-purple-600">
                          {formatCurrency(dailySuggestion)}
                        </p>
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">📊 Per minggu</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(dailySuggestion * 7)}
                        </p>
                      </div>
                    </div>
                    {dailySuggestion > totalBalance && totalBalance > 0 && (
                      <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Sisa budget tidak cukup untuk saran harian. Pertimbangkan untuk perpanjang deadline atau tambah budget.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Target Tabungan
              </CardTitle>
              <CardDescription>Tetapkan dan lacak tujuan tabungan Anda</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Target
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Target Tabungan Baru</DialogTitle>
                  <DialogDescription>
                    Buat target tabungan untuk tujuan keuangan Anda
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Nama Target</Label>
                    <Input
                      id="goal-name"
                      placeholder="Contoh: Laptop Baru, Liburan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-amount">Target Jumlah (Rp)</Label>
                    <Input
                      id="goal-amount"
                      type="number"
                      placeholder="0"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal-deadline">Batas Waktu</Label>
                    <Input
                      id="goal-deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Target
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada target tabungan. Mulai rencanakan keuangan Anda!
            </div>
          ) : (
            <div className="space-y-6">
              {goals.map((goal) => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                const daysRemaining = getDaysRemaining(goal.deadline);
                const isAchieved = percentage >= 100;
                const isOverdue = daysRemaining < 0;

                return (
                  <div key={goal.id} className="space-y-3 p-4 border-2 rounded-xl bg-gradient-to-br from-white to-purple-50 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{goal.name}</h3>
                          {isAchieved && (
                            <span className="text-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full shadow-sm">
                              ✓ Tercapai!
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveGoal(goal.id, goal.name)}
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <Progress value={Math.min(percentage, 100)} className="h-3" />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isOverdue ? (
                          <span className="text-red-600 font-medium">⚠️ Terlambat {Math.abs(daysRemaining)} hari</span>
                        ) : (
                          <span>📅 {daysRemaining} hari tersisa</span>
                        )}
                      </span>
                      <span className="font-bold text-purple-600">{percentage.toFixed(1)}%</span>
                    </div>

                    {!isAchieved && (
                      <div className="flex gap-2 pt-2">
                        <Input
                          type="number"
                          placeholder="Tambah jumlah"
                          value={addAmount[goal.id] || ''}
                          onChange={(e) => setAddAmount({ ...addAmount, [goal.id]: e.target.value })}
                          className="border-2"
                        />
                        <Button 
                          onClick={() => handleAddToGoal(goal.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          disabled={totalBalance <= 0}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Tambah
                        </Button>
                      </div>
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