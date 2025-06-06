import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Lock, User } from 'lucide-react';
import Footer from '@/components/ui/footer';

export default function Login() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeRole, setActiveRole] = useState<'customer' | 'employee'>('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(username, password);

    if (success) {
      if (username === 'employee1') {
        navigate('/product-management');
      } else {
        navigate('/products');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const autofill = (role: 'customer' | 'employee') => {
    if (role === 'customer') {
      setUsername('customer1');
      setPassword('pass123');
      setActiveRole('customer');
    } else {
      setUsername('employee1');
      setPassword('pass456');
      setActiveRole('employee');
    }
  };

return (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <div className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">AWE Electronics</h1>
          <p className="mt-2 text-lg text-gray-600">E-commerce prototype showcasing design patterns by Swinsoft Consulting</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to access the application</CardDescription>
          </CardHeader>

          <Tabs defaultValue="customer" value={activeRole} onValueChange={(v) => setActiveRole(v as 'customer' | 'employee')}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="employee">Employee</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="customer">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Login as a customer to browse products and make purchases.
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Demo: <code>customer1 / pass123</code>{' '}
                  <Button type="button" variant="link" onClick={() => autofill('customer')} className="p-0 h-auto text-xs">
                    Autofill
                  </Button>
                </p>
              </CardContent>
            </TabsContent>

            <TabsContent value="employee">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Login as an employee to manage product listings.
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Demo: <code>employee1 / pass456</code>{' '}
                  <Button type="button" variant="link" onClick={() => autofill('employee')} className="p-0 h-auto text-xs">
                    Autofill
                  </Button>
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 p-3 rounded-md text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      placeholder={`Enter ${activeRole} username`}
                      className="pl-10"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="mb-2 font-medium">Design Patterns Demonstrated:</div>
          <ul className="space-y-1 text-xs">
            <li>Facade – Unified access to operations</li>
            <li>Strategy – Payment method handling</li>
            <li>Observer – Receipt & shipping generation</li>
            <li>Repository – Abstracted data access</li>
          </ul>
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

}
