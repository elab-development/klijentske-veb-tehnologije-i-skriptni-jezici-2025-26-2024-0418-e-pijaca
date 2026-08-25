# Uputstvo — Jovan Luković (2024/0418) — E-Pijaca

## Tvoja prica (kako objasniti ispitivacu)
Radio/la si svoj deo projekta **lokalno na svom racunaru** od **2026-06-23** do **2026-07-03**.2026.
(8 komitova; oblast: katalog proizvoda, spisak i pojedinačni proizvod, product API).
GitHub Classroom repo je otvoren **04.07.2026.** kad ste formirali tim —
tog dana dodajes svoje lokalne komitove u zajednicki repo.

> Ovo je normalan workflow: razvoj prvo lokalno, pa push u tek otvoreni repo.
> GitHub prikazuje autorski datum komita (jun-jul), a kreiranje repo-a i push su 04.07.

## Preduslovi
- Instaliran **Git** (`git --version`)
- **GitHub nalog** + prihvacen Classroom poziv (link: `f3ROuvVF`)
- Tvoj bundle (ZIP sa tvojim fajlovima + `commit.sh`)

## Koraci
1. **Kloniraj repo** (u git-bash):
   ```
   git clone https://github.com/elab-development/klijentske-veb-tehnologije-2024-2024-0560-e-pijaca
   cd klijentske-veb-tehnologije-2024-2024-0560-e-pijaca
   ```
2. **Raspakuj svoj bundle ZIP** preko roota klona — tvoji fajlovi idu u odgovarajuce `src/...` putanje.
3. **Proveri email** u `commit.sh` — mora biti email registrovan na tvom GitHub nalogu
   (inace se komit nece povezati sa tvojim profilom). Ako nije, izmeni ga.
4. **Pokreni skriptu**:
   ```
   bash commit.sh
   ```
5. Skripta sama: postavlja tvoj identitet, pravi granu, kreira komitove **sa datumima tvog rada**,
   pushuje ih i (ako imas feature granu) spaja u main.
6. **Proveri na GitHubu** da su tvoji komitovi tu (sa tvojim imenom i datumima jun-jul).

## Redosled — drugi!
Ti ides posle Nikole. Nikola mora prvi da pushuje main — zato skripta prvo radi git pull.

## Sta ako ne radi?
| Problem | Resenje |
|---|---|
| `git pull` ne uspe | Prethodni student jos nije pushovao — sacekaj. |
| Email se ne poklapa sa GitHubom | Izmeni `git config user.email` u skripti. |
| `git push` trazi lozinku | GitHub trazi **Personal Access Token**, ne lozinku (Settings → Developer settings → Tokens). |
| `pathspec did not match` | Nisi raspakovao bundle preko roota — ponovi korak 2. |
