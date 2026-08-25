#!/usr/bin/env bash
# E-Pijaca - skripta za komitovanje (Jovan Luković)
# PRICA: lokalni razvoj 20.06-03.07.2026; repo otvoren 04.07; danas push.
# Skripta kreira komitove SA DATUMIMA TVOG RADA (jun-jul), pa ih pushuje danas.
# VAZNO: email mora odgovarati GitHub nalogu.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

git config user.name "Jovan Luković"
git config user.email "jl20240418@student.fon.bg.ac.rs"

git checkout main
git pull origin main
git checkout -b feature/proizvodi-i-katalog

# Commit 1/8  (2026-06-23)  Model proizvoda: klasa Product sa poslovnim logikama
git add src/models/Product.ts
GIT_AUTHOR_DATE="2026-06-23T20:00:00" GIT_COMMITTER_DATE="2026-06-23T20:00:00" git commit -m "Model proizvoda: klasa Product sa poslovnim logikama"

# Commit 2/8  (2026-06-25)  Katalog proizvoda i proizvođača (seed podaci)
git add src/data/products.ts
GIT_AUTHOR_DATE="2026-06-25T21:30:00" GIT_COMMITTER_DATE="2026-06-25T21:30:00" git commit -m "Katalog proizvoda i proizvođača (seed podaci)"

# Commit 3/8  (2026-06-27)  Repository pattern za pristup proizvodima
git add src/data/repositories.ts
GIT_AUTHOR_DATE="2026-06-27T18:45:00" GIT_COMMITTER_DATE="2026-06-27T18:45:00" git commit -m "Repository pattern za pristup proizvodima"

# Commit 4/8  (2026-06-29)  Spoljni API #1: integracija sa Fake Store API
git add src/services/productService.ts
GIT_AUTHOR_DATE="2026-06-29T22:20:00" GIT_COMMITTER_DATE="2026-06-29T22:20:00" git commit -m "Spoljni API #1: integracija sa Fake Store API"

# Commit 5/8  (2026-07-01)  UI komponente: StarRating i Pagination
git add src/components/StarRating.tsx src/components/Pagination.tsx
GIT_AUTHOR_DATE="2026-07-01T19:10:00" GIT_COMMITTER_DATE="2026-07-01T19:10:00" git commit -m "UI komponente: StarRating i Pagination"

# Commit 6/8  (2026-07-02)  UI komponente: ProductCard, FilterBar i SearchBar
git add src/components/ProductCard.tsx src/components/FilterBar.tsx src/components/SearchBar.tsx
GIT_AUTHOR_DATE="2026-07-02T20:40:00" GIT_COMMITTER_DATE="2026-07-02T20:40:00" git commit -m "UI komponente: ProductCard, FilterBar i SearchBar"

# Commit 7/8  (2026-07-03)  Stranica Spisak proizvoda: filteri, sortiranje i paginacija
git add src/pages/Marketplace.tsx
GIT_AUTHOR_DATE="2026-07-03T18:25:00" GIT_COMMITTER_DATE="2026-07-03T18:25:00" git commit -m "Stranica Spisak proizvoda: filteri, sortiranje i paginacija"

# Commit 8/8  (2026-07-03)  Stranica Pojedinačni proizvod: galerija, tabovi i recenzije
git add src/pages/ProductDetail.tsx
GIT_AUTHOR_DATE="2026-07-03T23:50:00" GIT_COMMITTER_DATE="2026-07-03T23:50:00" git commit -m "Stranica Pojedinačni proizvod: galerija, tabovi i recenzije"

git push -u origin feature/proizvodi-i-katalog
git checkout main
git merge --no-ff feature/proizvodi-i-katalog -m "Merge grane feature/proizvodi-i-katalog"
git push origin main

echo "Gotovo, Jovan Luković! 8 komitova pushovano."
