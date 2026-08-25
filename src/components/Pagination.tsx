interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="pagination" aria-label="Paginacija">
      <button className="pagination__btn" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Prethodna">‹</button>
      {pages.map((p) => (
        <button key={p} className={`pagination__page ${p === page ? 'is-active' : ''}`.trim()} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button className="pagination__btn" disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Sledeća">›</button>
    </nav>
  );
}
