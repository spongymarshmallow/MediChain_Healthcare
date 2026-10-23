# MediChain Healthcare

A blockchain-inspired healthcare record platform with a single health identity per patient, consent-based record sharing, and dedicated dashboards for patients, doctors, hospitals, pharmacies, insurers and government health authorities.

Built with React, TypeScript, Vite, Tailwind CSS and Supabase.

---

## Table of Contents

- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Setup (Supabase)](#database-setup-supabase)
- [Available Scripts](#available-scripts)
- [Data Model](#data-model)
- [Notes and Limitations](#notes-and-limitations)

---

## Features

**Patient**
- Dashboard with health overview and key stats
- Medical timeline (lab reports, prescriptions, vaccinations, admissions)
- Consent Centre to approve or reject doctor access requests
- QR health card with emergency contact and blood group
- Medicine verification
- Symptom and health tracker with analytics charts
- Profile setup (height, weight, blood group, allergies, contacts)

**Doctor**
- Doctor login and dashboard
- Request access to a patient's records via their Health ID
- Prescribe module for issuing prescriptions

**Hospital**
- Hospital dashboard
- Blockchain explorer to browse the ledger of record transactions
- Medicine safety checks

**Pharmacy, Insurance, Government**
- Pharmacy dashboard for prescription fulfilment
- Insurance dashboard for claims
- Government dashboard for disease alerts and public health data

**General**
- Role-based protected routes
- In-app notifications
- Light and dark mode
- Skeleton loaders and responsive layout

---

## User Roles

| Role | Entry route | Access |
|------|-------------|--------|
| Patient | `/patient` | Own records, consents, QR card, health tracking |
| Doctor | `/doctor` | Consented patient records, prescribing |
| Hospital | `/hospital` | Hospital dashboard, blockchain explorer, medicine safety |
| Pharmacy | `/pharmacy` | Prescription fulfilment |
| Insurance | `/insurance` | Claims |
| Government | `/government` | Disease alerts and statistics |

The landing page (`/`) lets you pick a role. Patients and doctors go through their own authentication screens; other roles enter their dashboards directly.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| State | Zustand |
| Backend / Auth / DB | Supabase (PostgreSQL + Row Level Security) |
| Charts | Recharts |
| Icons | Lucide React |
| QR codes | qrcode.react |

---

## Project Structure

```
MediChain_Healthcare/
├── public/assets/images/        # Static images
├── supabase/migrations/         # SQL migrations (tables, RLS, functions, seed data)
├── src/
│   ├── components/              # Layout, Navbar, Sidebar, StatCard, BlockchainBlock, ...
│   ├── context/                 # NotificationContext
│   ├── data/                    # Mock data (patients, doctors, labs, prescriptions, ...)
│   ├── hooks/                   # usePatientData, useNotifications
│   ├── lib/supabase.ts          # Supabase client
│   ├── pages/
│   │   ├── patient/             # Dashboard, timeline, consent, QR card, tracker, ...
│   │   ├── doctor/              # Dashboard, prescribe module
│   │   ├── hospital/            # Dashboard, blockchain explorer, medicine safety
│   │   ├── pharmacy/
│   │   ├── insurance/
│   │   ├── government/
│   │   ├── LoginPage.tsx
│   │   ├── PatientAuth.tsx
│   │   ├── DoctorAuth.tsx
│   │   ├── NotificationsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/                   # Zustand stores (auth, consent, prescriptions, ...)
│   ├── types/                   # Shared TypeScript types
│   ├── utils/                   # Hash generator, risk scorer, date helpers
│   ├── App.tsx                  # Routes and protected-route logic
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig*.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A free [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone https://github.com/spongymarshmallow/MediChain_Healthcare.git
cd MediChain_Healthcare
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Both values are in your Supabase dashboard under **Project Settings → API**.

> `.env` is git-ignored. Never commit your keys.

### 4. Set up the database

See [Database Setup](#database-setup-supabase) below.

### 5. Run the app

```bash
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

---

## Database Setup (Supabase)

SQL migrations are in `supabase/migrations/`. Apply them in filename (timestamp) order, either:

- **Supabase Dashboard:** open **SQL Editor** and run each file in order, or
- **Supabase CLI:**

  ```bash
  supabase login
  supabase link --project-ref <your-project-ref>
  supabase db push
  ```

The migrations create the tables, Row Level Security policies, helper functions (`get_my_health_id()`, `health_id_exists()`), the `registered_doctors` seed list, and a mock-data sync for demo patients.

> The repo's migrations start at `002`. The base tables referenced by later migrations (such as `user_profiles`, `consent_requests`, `blockchain_transactions`, `medicines`, `hospitals`, `admissions`, `insurance_claims`, `disease_alerts`) must exist in your Supabase project before the later migrations will apply cleanly.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

---

## Data Model

Every patient is identified by a **Health ID** (format `MC-2026-00000001`). Row Level Security uses this ID as the main access key.

| Table | Purpose |
|-------|---------|
| `user_profiles` | Maps an authenticated user to a Health ID |
| `patient_details` | Name, age, height, weight, blood group, contacts, allergies |
| `doctor_consents` | Doctor access requests (Pending / Approved / Rejected) |
| `registered_doctors` | Doctor directory used for doctor login |
| `lab_reports` | Test results with per-parameter values |
| `prescriptions` | Medicines, dosage, frequency, fulfilment status |
| `vaccinations` | Vaccine history and next due dates |
| `health_logs` | Patient-entered symptom logs |
| `notifications` | Per-user in-app notifications |
| `consent_requests`, `blockchain_transactions` | Consent workflow and ledger entries |

---

## Notes and Limitations

- The "blockchain" is simulated: block hashes are generated in `src/utils/hashGenerator.ts` with a simple non-cryptographic hash. It is a demonstration of the concept, not a real distributed ledger.
- Several dashboards (hospital, pharmacy, insurance, government) render data from `src/data/*.ts` mock files rather than live database queries.
- Seeded doctor accounts use a default password defined in migration `009`. Change this before any real deployment.
- Do not store real patient data in this project.

---
