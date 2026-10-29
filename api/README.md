# Zentora API

The API is an Express application backed by MongoDB. For the complete project overview, prerequisites, and local development instructions, see the [repository README](../README.md).

## Configuration

Create a `.env` file in this `api` directory (that is, `api/.env` from the repository root) with the following variables:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/zentora
PORT=9000
ADMIN_NAME=Zentora Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

- `MONGODB_URI` is required. Set it to your local or hosted MongoDB connection string.
- `PORT` is optional and defaults to `9000`.
- `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are needed only when running the initial admin setup script.

The API loads `.env` using `dotenv`. Run API commands from this `api` directory so the file is found. Do not commit `.env` or use real credentials in examples.

## Install and run

```powershell
npm ci
npm run dev
```

For a non-development start, use `npm start`.

## Create the initial admin

With MongoDB available and the admin variables configured, run:

```powershell
npm run create-admin
```

The admin password must be 8–18 characters. The script creates an account only if the email is unused; it does not promote an existing non-admin account. If there are no plans yet, it also creates a free 10-credit demo plan. No payment is processed.

Do not deploy this prototype with real user data: password handling is not production-ready and the API does not provide production-grade authentication and authorization.
