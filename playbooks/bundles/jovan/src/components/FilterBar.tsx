import type { Category } from '../models/interfaces';
import { categories, regions, certificates } from '../data/products';

export interface FilterState {
  category: Category | 'Sve';
  minPrice: number;
  maxPrice: number;
  region: string | 'Sve';
  certificate: string | 'Sve';
  onlyDiscount: boolean;
}

export const initialFilters: FilterState = {
  category: 'Sve',
  minPrice: 0,
  maxPrice: 0,
  region: 'Sve',
  certificate: 'Sve',
  onlyDiscount: false,
};

interface FilterBarProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function FilterBar({ value, onChange, onApply, onReset }: FilterBarProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });
  return (
    <aside className="filter">
      <h3 className="filter__title">Filteri</h3>

      <div className="filter__group">
        <label className="filter__label">Kategorija</label>
        <select className="filter__select" value={value.category} onChange={(e) => set({ category: e.target.value as Category | 'Sve' })}>
          <option value="Sve">Sve kategorije</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
          ))}
        </select>
      </div>

      <div className="filter__group">
        <label className="filter__label">Cena (RSD)</label>
        <div className="filter__row">
          <input type="number" min={0} className="filter__num" value={value.minPrice || ''} placeholder="Od" onChange={(e) => set({ minPrice: Number(e.target.value) || 0 })} />
          <input type="number" min={0} className="filter__num" value={value.maxPrice || ''} placeholder="Do" onChange={(e) => set({ maxPrice: Number(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="filter__group">
        <label className="filter__label">Region</label>
        <select className="filter__select" value={value.region} onChange={(e) => set({ region: e.target.value })}>
          <option value="Sve">Svi regioni</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="filter__group">
        <label className="filter__label">Sertifikat</label>
        <select className="filter__select" value={value.certificate} onChange={(e) => set({ certificate: e.target.value })}>
          <option value="Sve">Svi</option>
          {certificates.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <label className="filter__check">
        <input type="checkbox" checked={value.onlyDiscount} onChange={(e) => set({ onlyDiscount: e.target.checked })} />
        Samo proizvodi na akciji
      </label>

      <div className="filter__actions">
        <button className="btn btn--primary btn--sm" onClick={onApply}>Primeni filtere</button>
        <button className="btn btn--ghost btn--sm" onClick={onReset}>Resetuj</button>
      </div>
    </aside>
  );
}
