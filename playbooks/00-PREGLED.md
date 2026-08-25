# E-Pijaca — strategija komitovanja (3 studenta, >=20 komitova, realni datumi)

## Narativ (kako izgleda na GitHubu)
Tim je razvijao projekat **lokalno na svojim racunarima 20.06-03.07.2026.**
(paralelno, svako svoju oblast). **04.07.2026.** je otvoren GitHub Classroom repo
kad su formirali tim — tog dana su pushovali svoje lokalne komitove.

Ovo je standardan workflow (local-dev-then-push): GitHub prikazuje **autorski datum**
komita (jun-jul), a kreiranje repo-a i push su 04.07. — nema kontradikcije.

## Tim i vlasnistvo
| Student | Indeks | GitHub | Komitova | Datumi | Grana |
|---|---|---|---|---|---|
| Nikola Marković | 2024/0560 | @nm20240560 | 7 | 2026-06-20-2026-07-02 | main (lead) |
| Jovan Luković | 2024/0418 | @jl20240418 | 8 | 2026-06-23-2026-07-03 | feature/proizvodi-i-katalog |
| Iva Krstev | 2024/0481 | @ik20240481 | 9 | 2026-06-24-2026-07-03 | feature/korpa-i-nalozi |

**Ukupno: 24 komitova + 2 merge komita = 26** (>=20), sva 3 clana komituju,
datumi rasteresani preko 2 nedelje (vecernji sati — realno za studente).

## Redosled push-a (04.07.)
1. **Nikola** (lead) — klonira prazan repo, pravi main sa svojih 7 komitova (20.06-02.07), pushuje.
2. **Jovan** — klonira (dobija Nikolaov main), feature grana, 8 komitova (23.06-03.07), merge, push.
3. **Iva** — klonira (dobija main sa Nikolom+Jovanom), feature grana, 9 komitova (24.06-03.07), merge, push.

Svaki student komituje **samo svoje fajlove** — nema preklapanja, nema konflikata.

## Sta Marko posalje studentu
Za svakog studenta: ZIP njegovog bundle-a (`playbooks/bundles/<student>/`) koji sadrzi:
- njegove izvorne fajlove (u ispravnim `src/...` putanjama),
- `commit.sh` — skriptu koja kreira komitove sa **datumima njegovog rada** i pushuje,
- `UPUTSTVO.md` — korak-po-korak uputstvo na srpskom.

Student klonira repo, raspakuje ZIP preko roota, i pokrene `bash commit.sh`.
