import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Order, User } from '@shared/schema';
import { AuthFacade } from '@/patterns';
import { UserOperationFacade } from '@/patterns/facade/UserOperationFacade';

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  getOrders: () => Promise<Order[]>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authFacade = new AuthFacade();

  useEffect(() => {
    if (import.meta.env.DEV) {
      localStorage.removeItem('user');
    }

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const authenticatedUser = await authFacade.login(username, password); // missing `await`

      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getOrders = async (): Promise<Order[]> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const facade = new UserOperationFacade();
      return await facade.getOrders();
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    getOrders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
