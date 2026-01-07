import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, Transaction } from '../types';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = showCustomCategory ? customCategory : category;

    if (!finalCategory || !amount || !description) {
      toast.error('Mohon lengkapi semua field! 📝');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Jumlah harus berupa angka positif! 🔢');
      return;
    }

    onAddTransaction({
      type,
      category: finalCategory,
      amount: numAmount,
      description,
      transactionDate: date,
    });

    // Reset form
    setCategory('');
    setCustomCategory('');
    setShowCustomCategory(false);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);

    const emoji = type === 'income' ? '💰' : '💸';
    toast.success(`${emoji} ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan!`);
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          Tambah Transaksi
        </CardTitle>
        <CardDescription>Catat pemasukan atau pengeluaran Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <TrendingDown className="h-4 w-4" />
                Pengeluaran
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4" />
                Pemasukan
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            {!showCustomCategory ? (
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  id="custom-category"
                  placeholder="Ketik kategori baru..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="border-2 border-purple-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomCategory(false);
                    setCustomCategory('');
                  }}
                  className="w-full"
                >
                  ← Kembali ke kategori
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder="Contoh: Makan siang di kampus"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Transaksi
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}