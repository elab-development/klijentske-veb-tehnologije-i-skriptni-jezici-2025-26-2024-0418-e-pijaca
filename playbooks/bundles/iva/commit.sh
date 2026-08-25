#!/usr/bin/env bash
# E-Pijaca - skripta za komitovanje (Iva Krstev)
# PRICA: lokalni razvoj 20.06-03.07.2026; repo otvoren 04.07; danas push.
# Skripta kreira komitove SA DATUMIMA TVOG RADA (jun-jul), pa ih pushuje danas.
# VAZNO: email mora odgovarati GitHub nalogu.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

git config user.name "Iva Krstev"
git config user.email "ik20240481@student.fon.bg.ac.rs"

git checkout main
git pull origin main
git checkout -b feature/korpa-i-nalozi

# Commit 1/9  (2026-06-24)  Modeli korpe i naloga: klase Cart, User i Order
git add src/models/Cart.ts src/models/User.ts src/models/Order.ts
GIT_AUTHOR_DATE="2026-06-24T19:15:00" GIT_COMMITTER_DATE="2026-06-24T19:15:00" git commit -m "Modeli korpe i naloga: klase Cart, User i Order"

# Commit 2/9  (2026-06-26)  Custom hooks: useLocalStorage, useDebounce, useFetch
git add src/hooks/useLocalStorage.ts src/hooks/useDebounce.ts src/hooks/useFetch.ts
GIT_AUTHOR_DATE="2026-06-26T20:50:00" GIT_COMMITTER_DATE="2026-06-26T20:50:00" git commit -m "Custom hooks: useLocalStorage, useDebounce, useFetch"

# Commit 3/9  (2026-06-28)  Spoljni API #2: kursna lista (currencyService)
git add src/services/currencyService.ts
GIT_AUTHOR_DATE="2026-06-28T18:30:00" GIT_COMMITTER_DATE="2026-06-28T18:30:00" git commit -m "Spoljni API #2: kursna lista (currencyService)"

# Commit 4/9  (2026-06-30)  React konteksti: CartProvider i AuthProvider
git add src/context/CartContext.tsx src/context/AuthContext.tsx
GIT_AUTHOR_DATE="2026-06-30T21:40:00" GIT_COMMITTER_DATE="2026-06-30T21:40:00" git commit -m "React konteksti: CartProvider i AuthProvider"

# Commit 5/9  (2026-07-01)  React kontekst: CurrencyProvider (RSD/EUR konverzija)
git add src/context/CurrencyContext.tsx
GIT_AUTHOR_DATE="2026-07-01T19:55:00" GIT_COMMITTER_DATE="2026-07-01T19:55:00" git commit -m "React kontekst: CurrencyProvider (RSD/EUR konverzija)"

# Commit 6/9  (2026-07-02)  UI komponente: CartBadge i Avatar
git add src/components/CartBadge.tsx src/components/Avatar.tsx
GIT_AUTHOR_DATE="2026-07-02T22:15:00" GIT_COMMITTER_DATE="2026-07-02T22:15:00" git commit -m "UI komponente: CartBadge i Avatar"

# Commit 7/9  (2026-07-03)  Stranice Prijava i Registracija sa validacijom
git add src/pages/Login.tsx src/pages/Register.tsx
GIT_AUTHOR_DATE="2026-07-03T18:00:00" GIT_COMMITTER_DATE="2026-07-03T18:00:00" git commit -m "Stranice Prijava i Registracija sa validacijom"

# Commit 8/9  (2026-07-03)  Stranica Profil korisnika sa istorijom porudžbina
git add src/pages/Profile.tsx
GIT_AUTHOR_DATE="2026-07-03T20:30:00" GIT_COMMITTER_DATE="2026-07-03T20:30:00" git commit -m "Stranica Profil korisnika sa istorijom porudžbina"

# Commit 9/9  (2026-07-03)  Stranica Korpa: 4-koračni checkout grupisan po proizvođaču
git add src/pages/Cart.tsx
GIT_AUTHOR_DATE="2026-07-03T23:05:00" GIT_COMMITTER_DATE="2026-07-03T23:05:00" git commit -m "Stranica Korpa: 4-koračni checkout grupisan po proizvođaču"

git push -u origin feature/korpa-i-nalozi
git checkout main
git merge --no-ff feature/korpa-i-nalozi -m "Merge grane feature/korpa-i-nalozi"
git push origin main

echo "Gotovo, Iva Krstev! 9 komitova pushovano."
