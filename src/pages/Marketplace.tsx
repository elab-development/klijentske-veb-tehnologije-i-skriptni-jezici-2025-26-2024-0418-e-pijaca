import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { producers } from '../data/products';
import ProductCard from '../components/ProductCard';
import FilterBar, { initialFilters, type FilterState } from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';

const PER_PAGE = 12; // Figma prikazuje 12 proizvoda po strani
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

  // Logika za prikazivanje brojeva u podnaslovu
  const currentStart = pageItems.length > 0 ? (page - 1) * PER_PAGE + 1 : 0;
  const currentEnd = Math.min(page * PER_PAGE, filtered.length);
  const pageTitle = applied.category !== 'Sve' ? `${applied.category} - sveža berba` : 'Svi proizvodi';

  return (
    <div className="marketplace">
      {/* Gornji deo sa breadcrumbs i naslovom */}
      <div className="marketplace__top">
        <div className="breadcrumbs">
          <Link to="/">Početna</Link> &rsaquo; <Link to="/proizvodi">Proizvodi</Link> &rsaquo; <span>{applied.category !== 'Sve' ? applied.category : 'Svi proizvodi'}</span>
        </div>
        
        <div className="marketplace__header-main">
          <div className="marketplace__title-wrap">
            <h1>{pageTitle}</h1>
            <p className="marketplace__meta">Prikazano {currentStart}-{currentEnd} od {filtered.length} proizvoda &middot; ažurirano pre 2 sata</p>
          </div>
          
          <div className="marketplace__tools">
            <span className="sort-label">Sortiraj:</span>
            <select className="marketplace__sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sortiranje">
              <option value="popular">Najpopularnije</option>
              <option value="price-asc">Cena rastuće</option>
              <option value="price-desc">Cena opadajuće</option>
              <option value="rating">Najbolje ocenjeno</option>
            </select>
            {/* Opciono: dugmići za Grid/List view iz Figme */}
            <div className="view-toggles">
              <button className="view-btn is-active">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 1H7V7H1V1ZM9 1H15V7H9V1ZM1 9H7V15H1V9ZM9 9H15V15H9V9Z"/></svg>
              </button>
              <button className="view-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2H15V4H1V2ZM1 7H15V9H1V7ZM1 12H15V14H1V12Z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section marketplace__inner">
        <aside className="marketplace__filters">
          <FilterBar value={draft} onChange={setDraft} onApply={apply} onReset={reset} />
        </aside>
        
        <div className="marketplace__main">
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
          
          <div className="pagination-wrapper">
             <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}