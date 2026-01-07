import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Transaction, EXPENSE_CATEGORIES } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface FinancialChartsProps {
  transactions: Transaction[];
}

export function FinancialCharts({ transactions }: FinancialChartsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Category breakdown for expenses
  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === cat.value)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      name: cat.label,
      value: total,
    };
  }).filter(item => item.value > 0);

  // Monthly trend for last 6 months
  const getLast6Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('id-ID', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      });
    }
    return months;
  };

  const monthlyTrend = getLast6Months().map(({ month, year, monthIndex }) => {
    const income = transactions
      .filter(t => {
        const date = new Date(t.transactionDate);
        return t.type === 'income' && date.getMonth() === monthIndex && date.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => {
        const date = new Date(t.transactionDate);
        return t.type === 'expense' && date.getMonth() === monthIndex && date.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month,
      Pemasukan: income,
      Pengeluaran: expense,
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tren 6 Bulan Terakhir
          </CardTitle>
          <CardDescription>Perbandingan pemasukan dan pengeluaran</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `Rp ${value / 1000}k`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="Pemasukan" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Pengeluaran" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
            <CardDescription>Distribusi pengeluaran Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Belum ada data pengeluaran
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Kategori</CardTitle>
            <CardDescription>Total pengeluaran per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis tickFormatter={(value) => `Rp ${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Belum ada data pengeluaran
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
