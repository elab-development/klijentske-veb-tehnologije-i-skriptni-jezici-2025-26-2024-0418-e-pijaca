export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">🌿 e-Pijaca</span>
          <p className="footer__tagline">Sveže sa pijace, direktno do vrata.</p>
        </div>
        <div className="footer__cols">
          <div className="footer__col">
            <h4>Kupovina</h4>
            <a href="#/proizvodi">Svi proizvodi</a>
            <a href="#/korpa">Korpa</a>
          </div>
          <div className="footer__col">
            <h4>Tim</h4>
            <span>Nikola Marković · 2024/0560</span>
            <span>Jovan Luković · 2024/0418</span>
            <span>Iva Krstev · 2024/0481</span>
          </div>
          <div className="footer__col">
            <h4>FON 2024</h4>
            <span>Klijentske veb tehnologije</span>
            <span>Seminarski rad — Domaći 2</span>
          </div>
        </div>
      </div>
      <div className="footer__bottom">© 2026 e-Pijaca · FON · studentski projekat</div>
    </footer>
  );
}
