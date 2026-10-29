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

The UI currently sends API requests to `http://localhost:9000`. Configure the frontend API host before using it with an API deployed elsewhere.
