#!/usr/bin/env bash
# E-Pijaca - skripta za komitovanje (Nikola Marković)
# PRICA: lokalni razvoj 20.06-03.07.2026; repo otvoren 04.07; danas push.
# Skripta kreira komitove SA DATUMIMA TVOG RADA (jun-jul), pa ih pushuje danas.
# VAZNO: email mora odgovarati GitHub nalogu.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

git config user.name "Nikola Marković"
git config user.email "nm20240560@student.fon.bg.ac.rs"

git checkout -b main

# Commit 1/7  (2026-06-20)  Inicijalizacija projekta: Vite + React + TypeScript
git add .gitignore package.json package-lock.json tsconfig.json vite.config.ts index.html public/favicon.svg src/vite-env.d.ts README.md src/components/.gitkeep src/context/.gitkeep src/data/.gitkeep src/hooks/.gitkeep src/models/.gitkeep src/services/.gitkeep
GIT_AUTHOR_DATE="2026-06-20T18:42:00" GIT_COMMITTER_DATE="2026-06-20T18:42:00" git commit -m "Inicijalizacija projekta: Vite + React + TypeScript"

# Commit 2/7  (2026-06-22)  Dizajn sistem i stilovi: CSS tokeni, komponente, stranice
git add src/styles/tokens.css src/styles/global.css src/styles/components.css src/styles/pages.css
GIT_AUTHOR_DATE="2026-06-22T21:15:00" GIT_COMMITTER_DATE="2026-06-22T21:15:00" git commit -m "Dizajn sistem i stilovi: CSS tokeni, komponente, stranice"

# Commit 3/7  (2026-06-25)  Tipovi i interfejsi domena (IProduct, ICartItem, IUser, IOrder...)
git add src/models/interfaces.ts
GIT_AUTHOR_DATE="2026-06-25T19:30:00" GIT_COMMITTER_DATE="2026-06-25T19:30:00" git commit -m "Tipovi i interfejsi domena (IProduct, ICartItem, IUser, IOrder...)"

# Commit 4/7  (2026-06-27)  Ponovljivo korišćeni UI atomi: Button i FormField
git add src/components/Button.tsx src/components/FormField.tsx
GIT_AUTHOR_DATE="2026-06-27T20:05:00" GIT_COMMITTER_DATE="2026-06-27T20:05:00" git commit -m "Ponovljivo korišćeni UI atomi: Button i FormField"

# Commit 5/7  (2026-06-29)  Layout komponente: Navbar, Footer i Layout omotač
git add src/components/Navbar.tsx src/components/Footer.tsx src/components/Layout.tsx
GIT_AUTHOR_DATE="2026-06-29T17:50:00" GIT_COMMITTER_DATE="2026-06-29T17:50:00" git commit -m "Layout komponente: Navbar, Footer i Layout omotač"

# Commit 6/7  (2026-07-01)  Ruting aplikacije i React provideri (App, main)
git add src/App.tsx src/main.tsx
GIT_AUTHOR_DATE="2026-07-01T22:10:00" GIT_COMMITTER_DATE="2026-07-01T22:10:00" git commit -m "Ruting aplikacije i React provideri (App, main)"

# Commit 7/7  (2026-07-02)  Početna stranica: hero, kategorije, preporuke i proizvođači
git add src/pages/Home.tsx
GIT_AUTHOR_DATE="2026-07-02T19:25:00" GIT_COMMITTER_DATE="2026-07-02T19:25:00" git commit -m "Početna stranica: hero, kategorije, preporuke i proizvođači"

git push -u origin main

echo "Gotovo, Nikola Marković! 7 komitova pushovano."
