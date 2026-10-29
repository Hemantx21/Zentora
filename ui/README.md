# Zentora frontend

The frontend is a React application built with Vite. It provides public pages and role-specific dashboards for clients, freelancers, and administrators.

For full project setup instructions, API configuration, features, and security notes, see the [repository README](../README.md).

## Development

From this directory, install dependencies and start the Vite development server:

```powershell
npm ci
npm run dev
```

Other available scripts:

```powershell
npm run build
npm run preview
npm run lint
```

The UI uses `http://localhost:9000` during development and `https://zentora-u5tc.onrender.com` in production by default. Set `VITE_API_URL` to override the API host.

## Deploy to Vercel

Set the Vercel project's Root Directory to `ui`. Vercel uses `npm run build` and `dist` for the production build; `vercel.json` sends client-side routes to the app. The deployed frontend connects to `https://zentora-u5tc.onrender.com` by default. If you set `VITE_API_URL` in Vercel, use the public API origin with `https://` and no trailing slash, then redeploy.
