import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User } from '../models/User';
import type { IUser } from '../models/interfaces';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<IUser, 'id' | 'memberSince'>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useLocalStorage<IUser | null>('epijaca-user', null);
  const user = stored ? new User(stored) : null;

  const login: AuthContextValue['login'] = async (email, _password) => {
    // demo auth: prihvati bilo šta, vrati demo korisnika (Jovan Luković po Figma dizajnu)
    const u: IUser = {
      id: 1,
      firstName: 'Jovan',
      lastName: 'Luković',
      email,
      phone: '+381 60 123 4567',
      address: 'Bulevar oslobođenja 12, Novi Sad',
      memberSince: 'mart 2024.',
    };
    setStored(u);
    return true;
  };

  const register: AuthContextValue['register'] = async (data) => {
    const u: IUser = { ...data, id: Date.now(), memberSince: 'jul 2026.' };
    setStored(u);
    return true;
  };

  const logout = () => setStored(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth mora biti korišćen unutar AuthProvider');
  return ctx;
}
