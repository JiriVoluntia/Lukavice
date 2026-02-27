# Lukavice Portal v1.0

Moderní portál pro obec Lukavice s veřejným přístupem k informacím o zastupitelích a hlasováních, včetně administračního panelu.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Hosting**: Vercel (frontend) + Render (backend)

## Struktura projektu

```
lukavice-portal/
├── frontend/          # React aplikace
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── config/
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
│
├── backend/           # Express API
│   ├── src/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
│
└── README.md
```

## Setup

### Backend

1. Jdi do `backend/` složky
2. Vytvoř `.env` soubor:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/lukavice"
   NODE_ENV="production"
   PORT=3000
   ```
3. Nainstaluj dependencies: `npm install`
4. Migruj databázi: `npm run prisma:push`
5. Seeduj data: `npm run prisma:generate && npx prisma db seed`
6. Spusť server: `npm start`

### Frontend

1. Jdi do `frontend/` složky
2. Vytvoř `.env` soubor:
   ```
   VITE_API_URL=https://lukavice-backend.onrender.com
   ```
3. Nainstaluj dependencies: `npm install`
4. Spusť dev server: `npm run dev`
5. Build pro produkci: `npm run build`

## Deployment

### Backend (Render)

1. Připoj GitHub repo na Render
2. Nastav environment variables
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel)

1. Připoj GitHub repo na Vercel
2. Nastav environment variables
3. Build command: `npm run build`
4. Output directory: `dist`

## Features

- ✅ Veřejný přístup k informacím o zastupitelích
- ✅ Přehled hlasování s detaily
- ✅ Profily zastupitelů
- ✅ Administrační panel (chráněný Firebase Auth)
- ✅ Správa dat (zastupitelé, strany, hlasování)
- ✅ Responsive design
- ✅ Konzistentní design podle Tailwind CSS

## API Endpoints

### Public
- `GET /api/municipalities/:id` - Informace o obci
- `GET /api/municipalities/:id/councillors` - Seznam zastupitelů
- `GET /api/municipalities/:id/parties` - Seznam stran
- `GET /api/municipalities/:id/proposals` - Seznam hlasování
- `GET /api/proposals/:id` - Detail hlasování
- `GET /api/councillors/:id` - Detail zastupitele

### Admin (Protected)
- `POST /api/admin/councillors` - Vytvoř zastupitele
- `PUT /api/admin/councillors/:id` - Uprav zastupitele
- `DELETE /api/admin/councillors/:id` - Smaž zastupitele

## Databázové schéma

- **municipalities** - Obce
- **parties** - Politické strany
- **councillors** - Zastupitelé
- **proposals** - Návrhy/hlasování
- **votes** - Hlasy zastupitelů
- **users** - Administrátoři

## Kontakt

Pro otázky nebo problémy kontaktuj správce projektu.
