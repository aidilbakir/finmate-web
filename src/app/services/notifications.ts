import { Transaction, Budget, SavingsGoal } from '../types';
import { toast } from 'sonner';

const funnyMessages = {
  budgetAlmostOut: [
    'Budget {category} mauu habisss~ 🥺 Udah {percentage}% nih!',
    'Hati-hati yaa! Budget {category} tinggal {remaining} lagi! 😱',
    'Psst... Budget {category} hampir habis! Ayo hemat! 🙊',
    'Alert! Budget {category} udah {percentage}%! Jangan borong-borong ya! 🛒',
  ],
  budgetExceeded: [
    'Yaa ampunn! Budget {category} udah lewat {amount}! 😵',
    'Budget {category} jebol nih! Udah melebihi {amount}! 💸',
    'Kebobolan! Budget {category} udah over budget {amount}! 🚨',
    'Alamaaak! {category} udah melebihi budget {amount}! Stop shopping! 🛑',
  ],
  savingsClose: [
    'Yeay! Target "{goal}" tinggal {percentage}% lagi! Semangat! 🎯',
    'Wow! Tabungan "{goal}" udah {percentage}%! Hampir tercapai! 🎉',
    'Keren! "{goal}" tinggal dikit lagi! Keep saving! 💪',
  ],
  savingsAchieved: [
    'SELAMAT! 🎊 Target "{goal}" tercapai! Kamu keren banget! ✨',
    'Wohoo! 🎉 "{goal}" berhasil! Time to celebrate! 🥳',
    'Amazing! 💫 Target "{goal}" complete! You did it! 🏆',
  ],
  expenseTooMuch: [
    'Hmm... pengeluaran bulan ini udah banyak nih! Total {amount}! 🤔',
    'Wah wah! Udah keluar {amount} bulan ini! Yuk mulai hemat! 💰',
    'Reminder: pengeluaran bulan ini {amount}! Masih wajar kan? 😅',
  ],
  incomeReceived: [
    'Yeay! Ada pemasukan {amount}! 💵 Jangan lupa sisihkan buat nabung! 🐷',
    'Alhamdulillah! Dapat {amount}! 💸 Jangan boros ya! 😊',
    'Horeee! Masuk {amount}! ✨ Time to manage wisely! 📊',
  ],
  tips: [
    '💡 Tips: Sisihkan 20% dari uang saku untuk tabungan!',
    '💡 Tips: Catat semua pengeluaran, sekecil apapun!',
    '💡 Tips: Hindari belanja impulsif! Pikir 2x sebelum beli!',
    '💡 Tips: Bawa bekal dari rumah biar hemat!',
    '💡 Tips: Manfaatkan promo dan diskon dengan bijak!',
    '💡 Tips: Set budget harian, bukan cuma bulanan!',
    '💡 Tips: Nabung dulu, baru belanja! Jangan sebaliknya!',
    '💡 Tips: Track pengeluaran setiap hari, konsisten ya!',
  ],
  goodJob: [
    'Good job! Kamu rajin catat keuangan! Keep it up! 🌟',
    'Mantap! Budget masih aman terkendali! 👍',
    'Keren! Pengelolaan keuangan kamu bagus! 🎯',
    'Nice! Kamu mahasiswa yang bijak! 💰',
  ],
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getRandomMessage = (messages: string[], replacements?: Record<string, string>) => {
  let message = messages[Math.floor(Math.random() * messages.length)];
  
  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
  }
  
  return message;
};

export const notificationService = {
  checkBudgetAlerts(budgets: Budget[], transactions: Transaction[], categoryLabel: string) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => {
          const date = new Date(t.date);
          return (
            t.type === 'expense' &&
            t.category === budget.category &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spent / budget.limit) * 100;
      const remaining = budget.limit - spent;

      // Budget exceeded
      if (percentage >= 100) {
        const message = getRandomMessage(funnyMessages.budgetExceeded, {
          category: categoryLabel,
          amount: formatCurrency(Math.abs(remaining)),
        });
        toast.error(message, {
          duration: 5000,
        });
      }
      // Budget almost out (80-99%)
      else if (percentage >= 80) {
        const message = getRandomMessage(funnyMessages.budgetAlmostOut, {
          category: categoryLabel,
          percentage: percentage.toFixed(0),
          remaining: formatCurrency(remaining),
        });
        toast.warning(message, {
          duration: 4000,
        });
      }
    });
  },

  checkSavingsProgress(goal: SavingsGoal) {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;

    // Achieved
    if (percentage >= 100) {
      const message = getRandomMessage(funnyMessages.savingsAchieved, {
        goal: goal.name,
      });
      toast.success(message, {
        duration: 6000,
      });
    }
    // Close to target (80-99%)
    else if (percentage >= 80) {
      const message = getRandomMessage(funnyMessages.savingsClose, {
        goal: goal.name,
        percentage: (100 - percentage).toFixed(0),
      });
      toast.success(message, {
        duration: 4000,
      });
    }
  },

  notifyExpense(amount: number, monthlyTotal: number) {
    // Check if monthly expenses are high (over 1 million)
    if (monthlyTotal > 1000000) {
      const message = getRandomMessage(funnyMessages.expenseTooMuch, {
        amount: formatCurrency(monthlyTotal),
      });
      toast.warning(message, {
        duration: 4000,
      });
    }
  },

  notifyIncome(amount: number) {
    const message = getRandomMessage(funnyMessages.incomeReceived, {
      amount: formatCurrency(amount),
    });
    toast.success(message, {
      duration: 4000,
    });
  },

  showRandomTip() {
    const message = getRandomMessage(funnyMessages.tips);
    toast.info(message, {
      duration: 5000,
    });
  },

  showGoodJob() {
    const message = getRandomMessage(funnyMessages.goodJob);
    toast.success(message, {
      duration: 3000,
    });
  },

  welcomeUser(name: string, balance: number, monthlyExpense: number) {
    const greeting = balance >= 0 
      ? `Saldo kamu ${formatCurrency(balance)}! ${monthlyExpense > 0 ? 'Keep tracking ya! 📊' : 'Yuk mulai catat pengeluaran! ✨'}`
      : `Saldo minus ${formatCurrency(Math.abs(balance))}! Time to save! 💪`;

    toast.success(`Hai ${name}! 👋`, {
      description: greeting,
      duration: 4000,
    });
  },
};
