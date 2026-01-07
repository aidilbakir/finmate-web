import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { Auth } from "./components/Auth";
import { DashboardStats } from "./components/DashboardStats";
import { BudgetOverview } from "./components/BudgetOverview";
import { OverallBudget } from "./components/OverallBudget";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { BudgetManager } from "./components/BudgetManager";
import { SavingsGoals } from "./components/SavingsGoals";
import { FinancialCharts } from "./components/FinancialCharts";
import {
  Transaction,
  Budget,
  SavingsGoal,
  EXPENSE_CATEGORIES,
} from "./types";
// import { storageService } from "./services/storage"; // Not used anymore
import { transactionService, budgetService, savingsService } from "./services/api";
import { notificationService } from "./services/notifications";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  TrendingDown,
  LogOut,
  Lightbulb,
  Calculator,
} from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(
    null,
  );
  const [userName, setUserName] = useState<string>("");
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<
    SavingsGoal[]
  >([]);

  // Check if user is logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem(
      "finmate_current_user",
    );
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
      const users = JSON.parse(
        localStorage.getItem("finmate_users") || "[]",
      );
      const user = users.find(
        (u: any) => u.username === loggedInUser,
      );
      if (user) {
        setUserName(user.name);
      }
    }
  }, []);

  // Load data from Backend API
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          const [fetchedTransactions, fetchedBudgets, fetchedGoals] =
            await Promise.all([
              transactionService.getAll(),
              budgetService.getAll(),
              savingsService.getAll(),
            ]);

          console.log("Fetched Data:", { fetchedTransactions, fetchedBudgets, fetchedGoals });

          setTransactions(fetchedTransactions || []);
          setBudgets(fetchedBudgets || []);
          setSavingsGoals(fetchedGoals || []);

          // Calculate notification data
          const totalIncome = (fetchedTransactions || [])
            .filter((t: any) => t.type === "income")
            .reduce((sum: number, t: any) => sum + t.amount, 0);
          const totalExpense = (fetchedTransactions || [])
            .filter((t: any) => t.type === "expense")
            .reduce((sum: number, t: any) => sum + t.amount, 0);

          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const monthlyExpense = (fetchedTransactions || [])
            .filter((t: any) => {
              const date = new Date(t.transactionDate); // Ensure property name matches API (transactionDate)
              return (
                t.type === "expense" &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
              );
            })
            .reduce((sum: number, t: any) => sum + t.amount, 0);

          setTimeout(() => {
            notificationService.welcomeUser(
              userName,
              totalIncome - totalExpense,
              monthlyExpense,
            );
          }, 1000);

        } catch (error) {
          console.error("Failed to fetch data:", error);
          // Optional: Show error toast
        }
      };

      fetchData();

      // Show random tip
      setTimeout(() => {
        notificationService.showRandomTip();
      }, 5000);
    }
  }, [currentUser, userName]);

  // Remove LocalStorage Sync Effects (handled by API now)
  // ... removed storageService effects ...

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem("finmate_current_user", username);
    const users = JSON.parse(
      localStorage.getItem("finmate_users") || "[]",
    );
    const user = users.find(
      (u: any) => u.username === username,
    );
    if (user) {
      setUserName(user.name);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserName("");
    localStorage.removeItem("finmate_current_user");
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
  };

  const handleAddTransaction = async (
    transaction: Omit<Transaction, "id">,
  ) => {
    try {
      // Optimistic UI update or wait for API? Let's wait for API to get real ID
      const createdTransaction = await transactionService.create(transaction);
      setTransactions([...transactions, createdTransaction]);

      // Trigger notifications
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyExpense = [...transactions, createdTransaction]
        .filter((t: any) => {
          const date = new Date(t.transactionDate);
          return (
            t.type === "expense" &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      if (transaction.type === "expense") {
        // Check budget alerts
        const categoryLabel =
          EXPENSE_CATEGORIES.find(
            (c) => c.value === transaction.category,
          )?.label || transaction.category;
        setTimeout(() => {
          notificationService.checkBudgetAlerts(
            budgets,
            [...transactions, createdTransaction],
            categoryLabel,
          );
        }, 500);

        // Check if monthly expenses are high
        setTimeout(() => {
          notificationService.notifyExpense(
            transaction.amount,
            monthlyExpense,
          );
        }, 1000);
      } else if (transaction.type === "income") {
        setTimeout(() => {
          notificationService.notifyIncome(transaction.amount);
        }, 500);
      }

      // Random good job message (20% chance)
      if (Math.random() < 0.2) {
        setTimeout(() => {
          notificationService.showGoodJob();
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleUpdateGoals = async (goals: SavingsGoal[]) => {
    // Note: SavingsGoals component likely handles the update logic internally or this just refreshes state
    // If this is called after a change, we might need to re-fetch or trust the passed 'goals'
    // For now, assuming goals are updated. Ideally, we should sync specific changes via API
    // Since this signature is just 'setSavingsGoals(goals)', it implies local state update.
    // But we need API persistence. 
    // SavingsGoals component seems to pass the *new list*.
    // We should probably rely on the child component calling API for additions.
    setSavingsGoals(goals);
  };

  const handleShowTip = () => {
    notificationService.showRandomTip();
  };

  // Show auth screen if not logged in
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-200 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FinMate
                </h1>
                <p className="text-sm text-muted-foreground">
                  💰 Halo, {userName}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowTip}
                className="hidden sm:flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Tips
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid bg-white/80 backdrop-blur-md shadow-md border border-purple-200">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">
                Dashboard
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">
                Transaksi
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="budget"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger
              value="savings"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Tabungan</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Laporan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats transactions={transactions} />
            <BudgetOverview
              budgets={budgets}
              transactions={transactions}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionForm
                onAddTransaction={handleAddTransaction}
              />
              <TransactionList
                transactions={transactions.slice(-5).reverse()}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="transactions"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TransactionForm
                onAddTransaction={handleAddTransaction}
              />
              <div className="lg:col-span-2">
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <div className="space-y-6">
              <OverallBudget
                budgets={budgets}
                transactions={transactions}
              />
              <BudgetManager
                budgets={budgets}
                transactions={transactions}
                onUpdateBudgets={setBudgets}
              />
            </div>
          </TabsContent>

          <TabsContent value="savings">
            <SavingsGoals
              goals={savingsGoals}
              budgets={budgets}
              transactions={transactions}
              onUpdateGoals={handleUpdateGoals}
              onAddTransaction={handleAddTransaction}
            />
          </TabsContent>

          <TabsContent value="reports">
            <FinancialCharts transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 mt-12">
        <div className="text-center text-sm text-muted-foreground border-t border-purple-200 pt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <p className="font-semibold text-gray-700">
            © 2025 FinMate - Aplikasi Manajemen Keuangan untuk
            Mahasiswa
          </p>
          <p className="mt-1">
            💡 Kelola keuangan Anda dengan bijak untuk masa
            depan yang lebih baik
          </p>
        </div>
      </div>
    </div>
  );
}