import type { IProduct, IProducer, IReview } from '../models/interfaces';

export const producers: IProducer[] = [
  { id: 1, name: 'Voćnjak Mihajlović', location: 'Sremski Karlovci', region: 'Vojvodina', products: 'Jagode, maline, šljive', rating: 4.9, sales: 1420 },
  { id: 2, name: 'Pčelinjak Stamenković', location: 'Fruška Gora', region: 'Vojvodina', products: 'Med od bagrema', rating: 4.8, sales: 980 },
  { id: 3, name: 'Srpsko selo dairy', location: 'Valjevo', region: 'Zapadna Srbija', products: 'Mladi sir, kajmak, pavlaka, mleko', rating: 4.7, sales: 2100 },
  { id: 4, name: 'Bašta Petrović', location: 'Zemun', region: 'Beograd', products: 'Paradajz, krastavci, paprika, tikvice', rating: 4.6, sales: 1750 },
  { id: 5, name: 'Malinarski raj', location: 'Arilje', region: 'Zapadna Srbija', products: 'Maline, kupine, jagode, šljive', rating: 4.9, sales: 1340 },
  { id: 6, name: 'Zacinjeno imanje', location: 'Prokuplje', region: 'Južna Srbija', products: 'Kruske, borovnice', rating: 4.5, sales: 620 },
];

export const products: IProduct[] = [
  { id: 1, name: 'Jagode sa Fruške gore', category: 'Voće', price: 420, discount: 10, unit: '500g', producerId: 1, rating: 4.9, ratingCount: 267, soldCount: 1420, image: 'https://www.strongnature.rs/uploads/news/images/zasto-treba-da-jedete-jagode-93.webp', description: 'Sveže ubrane jagode sa porodičnih plantaža na obroncima Fruške gore. Slatke, sočne i punog ukusa.', inStock: true, certificate: 'Srpski proizvod', sorta: 'Albion', pakovanje: '500g posuda', berba: 'Jun 2026', rok: '5 dana od berbe' },
  { id: 2, name: 'Maline Arilje - ekološke', category: 'Voće', price: 550, unit: '500g', producerId: 5, rating: 4.9, ratingCount: 198, soldCount: 1340, image: 'https://lepotaizdravlje.rs/wp-content/uploads/2020/07/maline-voce-zdrava-ishrana-Getty-2.jpg', description: 'Aromatične maline iz Arilja, poznate širom Evrope. Bez pesticida.', inStock: true, certificate: 'Organska', sorta: 'Tulameen', pakovanje: '500g posuda', berba: 'Jul 2026', rok: '3 dana od berbe' },
  { id: 3, name: 'Šljive - domaće', category: 'Voće', price: 180, unit: 'kg', producerId: 1, rating: 4.7, ratingCount: 84, soldCount: 560, image: 'https://www.dobrojutro.co.rs/wp-content/uploads/2020/06/1b-AdobeStock_209627105.jpg', description: 'Zrele šljive iz voćnjaka Mihajlović. Idealne za pekmez i slatko.', inStock: true, certificate: 'Srpski proizvod', sorta: 'Čačanska rodna', pakovanje: 'Po kg', berba: 'Avgust 2026', rok: '7 dana' },
  { id: 4, name: 'Paradajz - baštenski', category: 'Povrće', price: 160, unit: 'kg', producerId: 4, rating: 4.6, ratingCount: 142, soldCount: 1750, image: 'https://cdn.agroklub.com/upload/images/text/thumb/depositphotos-116685160-l-2015-1-880x495-1.webp', description: 'Domaći paradajz iz Zemuna, ubran zrelo. Punog ukusa, za salatu i sos.', inStock: true, certificate: 'Srpski proizvod', sorta: 'Volovsko srce', pakovanje: 'Po kg', berba: 'Jul 2026', rok: '10 dana' },
  { id: 5, name: 'Krastavci - sveži', category: 'Povrće', price: 120, unit: 'kg', producerId: 4, rating: 4.5, ratingCount: 76, soldCount: 980, image: 'https://agrosavjet.com/_next/image?url=https%3A%2F%2Fuploads.agrosavjet.com%2Fuploads%2F2019%2F03%2FKRASTAVAC-large.webp&w=1280&q=75', description: 'Hrskavi krastavci iz bašte Petrović. Idealni za salatu i kiseljenje.', inStock: true, certificate: 'Srpski proizvod', sorta: 'Lifta', pakovanje: 'Po kg', berba: 'Jul 2026', rok: '8 dana' },
  { id: 6, name: 'Paprika - šarena', category: 'Povrće', price: 200, unit: 'kg', producerId: 4, rating: 4.6, ratingCount: 64, soldCount: 720, image: 'https://www.dobrojutro.co.rs/wp-content/uploads/2021/08/paprika-5-1024x768.jpg', description: 'Sveža paprika raznih boja. Slatka i sočna.', inStock: true, certificate: 'Srpski proizvod', sorta: 'Bova', pakovanje: 'Po kg', berba: 'Jul 2026', rok: '10 dana' },
  { id: 7, name: 'Mladi sir - domaći', category: 'Mlečni', price: 480, unit: 'kg', producerId: 3, rating: 4.8, ratingCount: 156, soldCount: 2100, image: 'https://www.hranazabebe.com/wp-content/uploads/2017/09/goat-1818552_1920-768x512.jpg', description: 'Prirodno zreo mladi sir iz Valjeva. Kremast i blagog ukusa.', inStock: true, certificate: 'Zlatna medalja', sorta: 'Kravlji', pakovanje: 'Po kg', berba: 'Nedeljno', rok: '14 dana' },
  { id: 8, name: 'Kajmak', category: 'Mlečni', price: 650, unit: '200g', producerId: 3, rating: 4.9, ratingCount: 98, soldCount: 890, image: 'https://www.seoskoblago.rs/wp-content/uploads/2020/07/20250726_092927.jpg', description: 'Pravi kajmak, ručno pravljen. Uz ajvar i pogaču nezamenljiv.', inStock: true, certificate: 'Zlatna medalja', sorta: 'Kravlji', pakovanje: '200g posuda', berba: 'Nedeljno', rok: '21 dan' },
  { id: 9, name: 'Med od bagrema', category: 'Med', price: 900, discount: 5, unit: '1kg', producerId: 2, rating: 4.8, ratingCount: 210, soldCount: 980, image: 'https://kegsfarm.com/wp-content/uploads/2024/10/p2.jpg', description: 'Čist med od bagrema sa Fruške gore. Svetao, blagog ukusa, kristalizuje se prirodno.', inStock: true, certificate: 'Organska', sorta: 'Bagrem', pakovanje: '1kg tegla', berba: 'Maj 2026', rok: 'Neograničeno' },
  { id: 10, name: 'Borovnice ', category: 'Voće', price: 130, unit: 'kg', producerId: 6, rating: 4.7, ratingCount: 70, soldCount: 113, image: 'https://sadniceprestiz.rs/wp-content/uploads/2023/09/sadnice-borovnice-duke.jpg', description: 'Sveže borovnice pravo sa berbe kod vas. Sočne i slatke, savršene za smutije.', inStock: true, certificate: 'Organska', sorta: 'Blukrop', pakovanje: '1kg', berba: 'Jun 2026', rok: '9 dana' },
  { id: 11, name: 'Jaja - slobodni uzgoj', category: 'Jaja', price: 240, unit: '10 kom', producerId: 4, rating: 4.7, ratingCount: 88, soldCount: 1200, image: 'https://borak.tv/wp-content/uploads/2026/01/d926d712-eedb-4741-a911-78d1060d5b6c-750x750.jpg', description: 'Sveža jaja iz slobodnog ispasta. Tamnožuta boja žumanca.', inStock: true, certificate: 'Slobodni ispust', sorta: 'Rasa domaća', pakovanje: '10 kom', berba: 'Dnevno', rok: '28 dana' },
  { id: 12, name: 'Kruške viljamovke', category: 'Voće', price: 280, unit: 'kg', producerId: 6, rating: 4.7, ratingCount: 68, soldCount: 210, image: 'https://big-win.hr/wp-content/uploads/2022/02/kruska_viljamovkazuta_starasorta_02.jpg', description: 'Sveže i sočne kruške viljamovke iz Prokuplja. Odlične za svežu potrošnju.', inStock: true, certificate: 'Organska', sorta: 'Viljamovka', pakovanje: '1kg', berba: 'Avgust 2026', rok: '15 dana' }
];

export const reviews: IReview[] = [
  { id: 1, productId: 1, author: 'Marija P.', rating: 5, date: '2026-06-20', text: 'Najbolje jagode koje sam jela! Sveže i slatke, dostava sutradan.' },
  { id: 2, productId: 1, author: 'Stefan N.', rating: 5, date: '2026-06-18', text: 'Odličan ukus, vidljivo da je iz pravog voćnjaka. Hoću opet.' },
  { id: 3, productId: 1, author: 'Ana K.', rating: 4, date: '2026-06-15', text: 'Vrlo ukusne, samo bih volela veće pakovanje.' },
  { id: 4, productId: 9, author: 'Petar L.', rating: 5, date: '2026-06-10', text: 'Pravi med, ne kao iz prodavnice. Oseti se bagrem.' },
];

export const categories: { key: string; label: string; emoji: string }[] = [
  { key: 'Voće', label: 'Voće', emoji: '🍎' },
  { key: 'Povrće', label: 'Povrće', emoji: '🥬' },
  { key: 'Mlečni', label: 'Mlečni', emoji: '🥛' },
  { key: 'Med', label: 'Med', emoji: '🍯' },
  { key: 'Jaja', label: 'Jaja', emoji: '🥚' },
  { key: 'Začini', label: 'Začini', emoji: '🌶' },
];

export const regions = ['Vojvodina', 'Beograd', 'Zapadna Srbija', 'Južna Srbija'];
export const certificates = ['Srpski proizvod', 'Organska', 'Zlatna medalja', 'Slobodni ispust'];
