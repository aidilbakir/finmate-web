import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { Trash2, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryLabel = (type: string, category: string) => {
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const handleDelete = (id: string, description: string) => {
    onDeleteTransaction(id);
    toast.success(`Transaksi "${description}" berhasil dihapus`);
  };

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Receipt className="h-5 w-5 text-white" />
          </div>
          Riwayat Transaksi
        </CardTitle>
        <CardDescription>
          Total {transactions.length} transaksi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada transaksi. Mulai catat keuangan Anda!
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full shadow-md ${transaction.type === 'income'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                      : 'bg-gradient-to-br from-red-400 to-pink-500 text-white'
                    }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{transaction.description}</p>
                      <Badge variant="outline" className="shrink-0">
                        {getCategoryLabel(transaction.type, transaction.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.transactionDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(String(transaction.id), transaction.description)}
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}