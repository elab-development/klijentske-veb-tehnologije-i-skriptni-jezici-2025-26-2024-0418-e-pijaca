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

  // Pomoćna funkcija za pilule aktivnih filtera
  const removeFilter = (key: keyof FilterState) => {
    set({ [key]: initialFilters[key] });
  };

  return (
    <aside className="filter">
      <div className="filter__head">
        <h3 className="filter__title">Filteri</h3>
        <button className="filter__reset" onClick={onReset}>Resetuj</button>
      </div>

      {/* Aktivni filteri (Pilule) */}
      <div className="filter__active-tags">
        <span className="filter__subtitle">Aktivni filteri</span>
        <div className="filter__tags">
          {value.category !== 'Sve' && (
            <span className="tag">{value.category} <button onClick={() => removeFilter('category')}>×</button></span>
          )}
          {value.certificate !== 'Sve' && (
            <span className="tag">BIO <button onClick={() => removeFilter('certificate')}>×</button></span>
          )}
          {value.maxPrice > 0 && (
            <span className="tag">do {value.maxPrice} RSD <button onClick={() => removeFilter('maxPrice')}>×</button></span>
          )}
        </div>
      </div>

      {/* Kategorije */}
      <div className="filter__group">
        <label className="filter__label">Kategorija</label>
        <div className="filter__list">
          {categories.map((c) => (
            <label className="custom-checkbox" key={c.key}>
              <input 
                type="checkbox" 
                checked={value.category === c.key} 
                onChange={() => set({ category: value.category === c.key ? 'Sve' : c.key })} 
              />
              <span className="checkmark"></span>
              <span className="checkbox-text">{c.label}</span>
              {/* Opciono: mock broj proizvoda (184) */}
              <span className="checkbox-count">(184)</span> 
            </label>
          ))}
        </div>
      </div>

      {/* Cena */}
      <div className="filter__group">
        <label className="filter__label">Cena (RSD)</label>
        <div className="price-slider-visual">
           <div className="price-slider-track"></div>
        </div>
        <div className="filter__row">
          <input type="number" min={0} className="filter__num" value={value.minPrice || ''} placeholder="100 RSD" onChange={(e) => set({ minPrice: Number(e.target.value) || 0 })} />
          <input type="number" min={0} className="filter__num" value={value.maxPrice || ''} placeholder="800 RSD" onChange={(e) => set({ maxPrice: Number(e.target.value) || 0 })} />
        </div>
      </div>

      {/* Region */}
      <div className="filter__group">
        <label className="filter__label">Region proizvođača</label>
        <div className="filter__list">
          {regions.map((r) => (
            <label className="custom-checkbox" key={r}>
              <input 
                type="checkbox" 
                checked={value.region === r} 
                onChange={() => set({ region: value.region === r ? 'Sve' : r })} 
              />
              <span className="checkmark"></span>
              <span className="checkbox-text">{r}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn--primary btn--full" onClick={onApply}>Primeni filtere</button>
    </aside>
  );
}