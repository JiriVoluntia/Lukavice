# Deployment Guide

## 1. Backend na Render

### Příprava

1. Pushni projekt na GitHub
2. Jdi na https://render.com
3. Klikni "New +" → "Web Service"
4. Vyber "Connect a repository" a vyber `lukavice-portal`

### Nastavení

- **Name**: `lukavice-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### Environment Variables

Přidej tyto proměnné:

```
DATABASE_URL=postgresql://lukavice_db_user:O0ypfCv6WBSfsK86brHRlM2S4BnjIjPi@dpg-d6gsc1p5pdvs73d8mf5g-a.frankfurt-postgres.render.com/lukavice_db
NODE_ENV=production
PORT=3000
```

### Databáze

1. Jdi do "Databases" na Render
2. Vyber `lukavice-db`
3. Zkopíruj "External Database URL"
4. Přidej ji do backend environment variables jako `DATABASE_URL`

### Migrace dat

Jakmile je backend deploynutý:

1. Jdi do backend Web Service
2. Klikni "Shell"
3. Spusť:
   ```bash
   npm run prisma:push
   npx prisma db seed
   ```

## 2. Frontend na Vercel

### Příprava

1. Jdi na https://vercel.com
2. Klikni "Add New..." → "Project"
3. Vyber `lukavice-portal` repo

### Nastavení

- **Framework**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables

Přidej:

```
VITE_API_URL=https://lukavice-backend.onrender.com
```

(Nahraď URL za tvůj backend URL z Render)

### Deploy

Klikni "Deploy" a čekej na dokončení.

## 3. Ověření

1. Jdi na frontend URL (z Vercel)
2. Ověř, že se načítají data
3. Jdi na `/login`
4. Přihlaš se s Firebase credentials
5. Ověř, že admin panel funguje

## Troubleshooting

### Backend se nespouští

- Zkontroluj logs na Render
- Ověř DATABASE_URL
- Ověř, že `npm start` funguje lokálně

### Frontend se nenačítá

- Zkontroluj VITE_API_URL
- Ověř, že backend je dostupný
- Zkontroluj browser console pro chyby

### Data se nenačítají

- Ověř, že databáze je seednutá
- Zkontroluj API endpoints na backendu
- Zkontroluj network tab v DevTools

## Lokální vývoj

### Backend

```bash
cd backend
npm install
# Vytvoř .env s DATABASE_URL
npm run prisma:push
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Vytvoř .env s VITE_API_URL=http://localhost:3000
npm run dev
```

Pak jdi na http://localhost:5173
