import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { producers } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterBar, { initialFilters, type FilterState } from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';

const PER_PAGE = 6;
type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

const effective = (p: { price: number; discount?: number }) =>
  p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;

export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const all = getAllProducts();

  const [draft, setDraft] = useState<FilterState>(() => ({
    ...initialFilters,
    category: (params.get('kategorija') as FilterState['category']) || 'Sve',
  }));
  const [applied, setApplied] = useState<FilterState>(draft);
  const [search, setSearch] = useState(params.get('q') ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const [sort, setSort] = useState<SortKey>('popular');
  const [page, setPage] = useState(1);

  // sinhronizacija kategorije/pretrage iz URL-a
  useEffect(() => {
    const k = params.get('kategorija') as FilterState['category'] | null;
    const q = params.get('q');
    const f = { ...initialFilters, category: k ?? 'Sve' };
    setDraft(f);
    setApplied(f);
    if (q != null) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    const list = all.filter((p) => {
      if (applied.category !== 'Sve' && p.category !== applied.category) return false;
      const eff = effective(p);
      if (applied.minPrice && eff < applied.minPrice) return false;
      if (applied.maxPrice && eff > applied.maxPrice) return false;
      const producer = producers.find((x) => x.id === p.producerId);
      if (applied.region !== 'Sve' && producer?.region !== applied.region) return false;
      if (applied.certificate !== 'Sve' && p.certificate !== applied.certificate) return false;
      if (applied.onlyDiscount && !p.discount) return false;
      if (q) {
        const producerName = producer?.name.toLowerCase() ?? '';
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !producerName.includes(q)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return effective(a) - effective(b);
        case 'price-desc': return effective(b) - effective(a);
        case 'rating': return b.rating - a.rating;
        default: return b.soldCount - a.soldCount;
      }
    });
  }, [all, applied, debouncedSearch, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => setPage(1), [applied, debouncedSearch, sort]);

  const apply = () => setApplied(draft);
  const reset = () => {
    setDraft(initialFilters);
    setApplied(initialFilters);
    setParams({});
    setSearch('');
  };

  return (
    <div className="marketplace">
      <div className="section marketplace__inner">
        <aside className="marketplace__filters">
          <FilterBar value={draft} onChange={setDraft} onApply={apply} onReset={reset} />
        </aside>
        <div className="marketplace__main">
          <div className="marketplace__head">
            <h1>Svi proizvodi</h1>
            <div className="marketplace__tools">
              <input className="marketplace__search" placeholder="Brza pretraga…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Pretraga" />
              <select className="marketplace__sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sortiranje">
                <option value="popular">Najpopularnije</option>
                <option value="price-asc">Cena rastuće</option>
                <option value="price-desc">Cena opadajuće</option>
                <option value="rating">Najbolje ocenjeno</option>
              </select>
            </div>
          </div>
          <p className="muted">{filtered.length} proizvoda {applied.category !== 'Sve' && `· ${applied.category}`}</p>
          {pageItems.length === 0 ? (
            <div className="empty">
              <span className="empty__emoji">🔍</span>
              <p>Nema proizvoda za izabrane filtere.</p>
              <button className="btn btn--outline btn--sm" onClick={reset}>Resetuj filtere</button>
            </div>
          ) : (
            <div className="grid">
              {pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
