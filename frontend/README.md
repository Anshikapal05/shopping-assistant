# Frontend (React + Vite)

This is the React app for the Voice Shopping Assistant.

## Scripts
- `npm run dev` – Start dev server
- `npm run build` – Build production assets to `dist/`
- `npm run preview` – Preview the production build

## Environment
Set the backend API base in `.env` files using Vite vars:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, create `frontend/.env.production` with your hosted backend URL.

## Deploying to Firebase Hosting
1. Build: `npm run build`
2. Init Hosting at repo root: `firebase init hosting` (public: `frontend/dist`, SPA: yes)
3. Deploy: `firebase deploy --only hosting`
