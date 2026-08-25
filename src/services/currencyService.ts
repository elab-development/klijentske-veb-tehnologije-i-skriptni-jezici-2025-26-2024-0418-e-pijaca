const API = 'https://open.er-api.com/v6/latest/EUR';

export interface Rates {
  RSD: number;
  EUR: number;
  USD: number;
}

/**
 * Spoljni API #2: kursna lista (open.er-api.com — besplatan, bez API ključa).
 * Koristi se u korpi za konverziju RSD <-> EUR.
 */
export async function fetchRates(): Promise<Rates> {
  const res = await fetch(API);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const rates = data.rates as Record<string, number> | undefined;
  if (!rates?.RSD) throw new Error('RSD kurs nije dostupan');
  return { RSD: rates.RSD, EUR: 1, USD: rates.USD ?? 1 };
}

export function convertRSDtoEUR(rsd: number, rates: Rates): number {
  return rsd / rates.RSD;
}
