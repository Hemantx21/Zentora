# Zentora

Zentora is a project marketplace prototype that connects clients who post work with freelancers who can browse projects and submit bids. It includes separate client, freelancer, and administrator experiences, with a React web interface and an Express API backed by MongoDB.

> **Development prototype:** The project is intended for local development and demonstration. Passwords are currently stored and handled without production-grade security, API routes do not implement robust authentication/authorization, and the sample plan flow does not process payments. Do not deploy it with real user data or use it as a production service without addressing these issues.

## Features

- Public landing, services, pricing, about, and contact pages.
- Account registration and login with client and freelancer account types.
- Client dashboard for posting projects, managing projects, reviewing bids, and updating a profile.
- Freelancer dashboard for browsing projects, submitting bids, tracking bids, purchasing demo credit plans, and updating a profile.
- Admin dashboard for viewing users, clients, projects, bids, plans, and statistics, and updating the admin profile.
- MongoDB persistence for users, projects, plans, subscriptions, and bids.
- One-time script to create an initial admin account and a demo plan.

## Technology

- **Frontend:** React 19, React Router, Vite, Bootstrap, Axios
- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose

## Repository layout

```text
.
├── api/                 # Express API, MongoDB models, routes, and admin setup script
│   ├── config/
│   ├── controller/
│   ├── model/
│   ├── router/
│   └── scripts/
└── ui/                  # React/Vite frontend
    └── src/
        └── components/  # Public pages and admin, client, and freelancer screens
```

## Prerequisites

- Node.js 20.19+ (or a compatible newer Node.js release) and npm.
- A MongoDB instance, either local or hosted.

## Local setup

### 1. Configure the API

In PowerShell, create `api/.env` and add your MongoDB connection string and initial administrator details:

```powershell
notepad api/.env
```

Use the following variables:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/zentora
PORT=9000
ADMIN_NAME=Zentora Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

Replace these example values as appropriate. For a hosted database, use its connection string for `MONGODB_URI`. The admin variables are required when creating the initial admin account. The setup script accepts passwords from 8 through 18 characters.

Keep `.env` private: it is ignored by Git. Never commit database credentials or real passwords.

### 2. Install dependencies

From the repository root, install the API and frontend dependencies in separate terminals:

```powershell
cd api
npm ci
```

```powershell
cd ui
npm ci
```

### 3. Create the initial admin and demo plan

With MongoDB running and the API environment variables configured, run this once from the `api` directory:

```powershell
npm run create-admin
```

The script creates an admin account only if the email is unused; it will not convert an existing non-admin account. If the database has no plans, it also adds a free 10-credit demo plan. No payment is processed.

### 4. Start the API and frontend

Run each command in its own terminal:

```powershell
cd api
npm run dev
```

```powershell
cd ui
npm run dev
```

The API listens on port `9000` by default. Vite prints the local frontend URL (normally `http://localhost:5173`) when it starts. Open that URL in a browser, register a client or freelancer account, or sign in with the admin account created above.

The frontend currently sends API requests directly to `http://localhost:9000`. To use a different API host or deploy the frontend, update those API URLs in the UI and configure the API's CORS policy for the intended frontend origin.

## Available scripts

### API (`api/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API using nodemon. |
| `npm start` | Start the API with Node.js. |
| `npm run create-admin` | Create the initial admin account and, if needed, a demo plan. |

### Frontend (`ui/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production frontend build in `ui/dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint on the frontend. |

The API package currently has no automated test suite configured.

## API routes

The API is mounted at the root path on port `9000` by default. These are the routes currently registered in `api/router/router.js`:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Register an account. |
| `POST` | `/login` | Log in. |
| `GET` | `/admin-users-list` | List users for the admin view. |
| `GET` | `/admin-clients-list` | List clients for the admin view. |
| `GET` | `/admin-project-list` | List projects for the admin view. |
| `POST` | `/admin-create-plan` | Create a plan. |
| `GET` | `/admin-get-plans` | List plans. |
| `GET` | `/admin-stats` | Get admin dashboard statistics. |
| `GET` | `/admin-biding-list` | List bids for the admin view. |
| `PUT` | `/admin-profile-update` | Update the admin profile. |
| `GET` | `/client-stats` | Get client dashboard statistics. |
| `POST` | `/client-post-project` | Post a project. |
| `GET` | `/client-project-list` | List a client's projects. |
| `GET` | `/client-biding-list` | List bids for a project. |
| `PUT` | `/client-biding-action` | Update a bid's status. |
| `PUT` | `/client-profile-update` | Update the client profile. |
| `GET` | `/user-stats` | Get freelancer dashboard statistics. |
| `GET` | `/user-project-list` | List projects for freelancers. |
| `POST` | `/user-purchase-plan` | Purchase a plan in the demo credit flow. |
| `POST` | `/user-create-bids` | Submit a bid. |
| `GET` | `/user-get-bids` | List a freelancer's bids. |
| `PUT` | `/user-profile-update` | Update the freelancer profile. |

## Security and deployment notes

- Do not use real credentials or personal data with this prototype.
- Password handling is not production-ready. Add secure password hashing and a properly designed authentication and authorization system before deployment.
- The API currently enables CORS broadly, and the frontend's API host is hard-coded to localhost. Restrict CORS and configure a suitable API base URL before hosting.
- The plan and credit workflow is for demonstration; it does not charge users or integrate with a payment provider.
- Set secrets through your hosting provider's environment configuration. Never include them in frontend `VITE_*` variables, which are exposed to browser users.
- For the API's additional setup guidance, see [`api/README.md`](./api/README.md).
