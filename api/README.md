# API setup and deployment

## Configure the API

Copy `.env.example` to `.env` in this folder and set `MONGODB_URI` to your MongoDB connection string. For local development, start MongoDB and use the example local URI. For deployment, use your hosted MongoDB URI and set these variables in the hosting provider's secret/environment-variable settings instead of uploading a `.env` file:

- `MONGODB_URI` (required): MongoDB connection string.
- `PORT` (optional): API port; defaults to `9000`.
- `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`: required only when running the one-time admin setup below.

Install dependencies with `npm install`, then start the API with `npm run dev` locally or `npm start` in deployment.

Never put database credentials or admin passwords in the UI's `VITE_*` variables: Vite embeds those values in public browser code.

## Create the initial admin and demo plan

Set the `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` values in `api/.env` (or provide them through your deployment provider's environment settings), then run the one-time command from this folder:

```powershell
npm run create-admin
```

The password must be 8-18 characters to match the login form. The script creates the admin only if the email is unused; it will not promote an existing client or freelancer account. If there are no plans yet, it also creates a free 10-credit demo plan for testing. No payment is processed.

After setup, open the UI's `/login` page and sign in using the admin email and password. Open **Plans** in the admin navigation to add plans. A freelancer can then open **Plans**, choose **Get Plan**, confirm the development credit grant, and use the credits to bid; each successful bid deducts one credit.

Do not use this prototype's plain-text password handling for a public production deployment.
