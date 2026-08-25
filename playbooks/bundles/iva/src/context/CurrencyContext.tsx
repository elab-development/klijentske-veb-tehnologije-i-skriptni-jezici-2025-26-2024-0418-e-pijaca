import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchRates, type Rates } from '../services/currencyService';

const RSD = new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 0 });

interface CurrencyContextValue {
  currency: 'RSD' | 'EUR';
  setCurrency: (c: 'RSD' | 'EUR') => void;
  rates: Rates | null;
  format: (rsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useLocalStorage<'RSD' | 'EUR'>('epijaca-currency', 'RSD');
  const [rates, setRates] = useState<Rates | null>(null);

  useEffect(() => {
    fetchRates().then(setRates).catch(() => setRates(null));
  }, []);

  const format = (rsd: number) => {
    if (currency === 'EUR' && rates) return `€ ${(rsd / rates.RSD).toFixed(2)}`;
    return `${RSD.format(rsd)} RSD`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency mora biti korišćen unutar CurrencyProvider');
  return ctx;
}
