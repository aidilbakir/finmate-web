import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Wallet, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import authService from '../services/authService';

interface AuthProps {
  onLogin: (username: string, name: string) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginUsername || !loginPassword) {
      toast.error('Username dan password harus diisi! 😢');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({
        username: loginUsername,
        password: loginPassword,
      });

      if (response.success && response.data) {
        onLogin(response.data.username, response.data.name);
        toast.success(`Selamat datang kembali, ${response.data.name}! 🎉`, {
          description: 'Yuk cek saldo kamu hari ini! 💰'
        });
      } else {
        toast.error('Login gagal! 🔒', {
          description: response.error || response.message || 'Username atau password salah'
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login gagal! 😢', {
        description: error.message || 'Terjadi kesalahan. Pastikan backend sudah running!'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerUsername || !registerPassword || !registerName) {
      toast.error('Semua field harus diisi! 📝');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Password minimal 6 karakter ya! 🔒');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Password tidak sama! 😵');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        username: registerUsername,
        password: registerPassword,
        name: registerName,
      });

      if (response.success) {
        toast.success(`Akun berhasil dibuat! 🎊`, {
          description: `Selamat datang ${registerName}! Silakan login untuk memulai! 💸`
        });

        // Clear register form
        setRegisterUsername('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setRegisterName('');

        // Auto login after register
        try {
          const loginResponse = await authService.login({
            username: registerUsername,
            password: registerPassword,
          });
          if (loginResponse.success && loginResponse.data) {
            onLogin(loginResponse.data.username, loginResponse.data.name);
          }
        } catch (loginError) {
          // If auto-login fails, just show success message
          console.log('Auto-login failed, user can login manually');
        }
      } else {
        toast.error('Registrasi gagal! 😢', {
          description: response.error || response.message || 'Username mungkin sudah dipakai'
        });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error('Registrasi gagal! 😢', {
        description: error.message || 'Terjadi kesalahan. Pastikan backend sudah running!'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl relative z-10 bg-white/95 backdrop-blur-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-lg">
              <Wallet className="h-12 w-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              FinMate
            </CardTitle>
            <CardDescription className="text-base mt-2">
              💰 Kelola Keuangan Mahasiswa dengan Mudah
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <UserPlus className="h-4 w-4" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    placeholder="Masukkan username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Masukkan password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Masuk'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nama Lengkap</Label>
                  <Input
                    id="register-name"
                    placeholder="Masukkan nama lengkap"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    placeholder="Pilih username"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Min. 6 karakter"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="Ketik ulang password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Daftar Sekarang'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}