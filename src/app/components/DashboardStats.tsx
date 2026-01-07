import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Transaction } from '../types';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

interface DashboardStatsProps {
  transactions: Transaction[];
}

export function DashboardStats({ transactions }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Get current month stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.transactionDate);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: 'Saldo Total',
      value: formatCurrency(balance),
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      description: 'Total saldo Anda',
    },
    {
      title: 'Pemasukan Bulan Ini',
      value: formatCurrency(monthlyIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      description: `${monthlyTransactions.filter(t => t.type === 'income').length} transaksi`,
    },
    {
      title: 'Pengeluaran Bulan Ini',
      value: formatCurrency(monthlyExpense),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-500 to-pink-600',
      description: `${monthlyTransactions.filter(t => t.type === 'expense').length} transaksi`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
            <div className={`p-2.5 rounded-xl ${stat.bgColor} shadow-md`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}