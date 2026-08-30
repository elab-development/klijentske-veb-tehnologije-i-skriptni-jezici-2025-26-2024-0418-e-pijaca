# 🌿 e-Pijaca — web aplikacija za poručivanje domaćih proizvoda

Seminarski rad iz predmeta **Klijentske veb tehnologije** (FON, Departman za e-biznis).
Tematska web aplikacija — elektronska pijaca koja povezuje lokalne proizvođače
sa kupcima. Sveže proizvode (voće, povrće, mlečni proizvodi, med, jaja, začine)
moguće je pretraživati, filtrirati i naručiti kroz 4-koračni proces kupovine.

> *„Sveže sa pijace, direktno do vrata.“*

## Tehnologije
- **Vite** + **React 18** + **TypeScript**
- **react-router-dom** v6 (ruting)
- CSS (dizajn tokeni iz Figma prototipa)
- localStorage (korpa, prijava, izbor valute)


## Funkcionalnosti
- ✅ 7 stranica: Prijava, Registracija, Početna, Profil, Spisak proizvoda, Pojedinačni proizvod, Korpa
- ✅ Filteri (kategorija, cena, region, sertifikat), sortiranje, pretraga, paginacija
- ✅ 4-koračni checkout (korpa → dostava → plaćanje → potvrda), grupisanje po proizvođaču, kod za popust, PDV
- ✅ Prijava/registracija sa localStorage sesijom
- ✅ Konverzija cena RSD ⇄ EUR
- ✅ Responsivni dizajn (media queries)
- ✅ 11 ponovljivo korišćenih komponenti, 4 klase, 8 interfejsa, 3 custom hook-a

## Pokretanje
```bash
npm install
npm run dev      # razvojni server na http://localhost:5173
npm run preview  # prikaz builda
```

## Struktura
```
src/
├── components/   # 11 ponovljivo korišćenih UI komponenti
├── context/      # CartContext, AuthContext, CurrencyContext
├── data/         # seed podaci (proizvodi, proizvođači) + repository
├── hooks/        # useLocalStorage, useDebounce, useFetch
├── models/       # klase Product, Cart, User, Order + interfejsi
├── pages/        # 7 stranica aplikacije
└── styles/       # tokens.css, global.css, components.css, pages.css
```

## Tim
| Student | Indeks | Oblast |
|---|---|---|
| Jovan Luković | 2024/0418 | stranica proizvodi, stranica pojedinacnih proizvoda |
| Nikola Marković | 2024/0560 | stranica o informacijama korisnika, stranica korpe korisnika |
| Iva Krstev | 2024/0481 | logovanje korisnika, forma za nov nalog, pocetna stranica prodavnice |

## Repo
`https://github.com/elab-development/klijentske-veb-tehnologije-i-skriptni-jezici-2025-26-2024-0418-e-pijaca.git`
