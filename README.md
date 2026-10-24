# Muscle UP — Admin Portal

React + Vite frontend for the Muscle UP gym membership management system.

## Admin authentication setup

The admin portal now uses Supabase email/password authentication and checks the signed-in user's `public.profiles` row. Only active users whose `role` is `admin` can open the existing admin UI. The staff portal is not included in this change.

### 1. Install dependencies

Use Node.js 20.19+ or 22.12+ and run this in the project folder:

```bash
npm install
```

### 2. Configure Supabase environment variables

Copy `.env.example` to `.env.local`, then set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Use the Supabase project URL and **publishable** key from the Supabase dashboard. Never put a service-role key in a frontend environment file or commit `.env.local` to GitHub. Vite environment variables are exposed to browser code, so only use the publishable key here.

### 3. Create the first admin account safely

Do not enable public sign-up in this admin portal. In the Supabase dashboard, open **Authentication → Users** and create the first user using an email you control. Then, in the SQL Editor, promote that specific user to admin by replacing the email below with the exact email used for that account:

```sql
update public.profiles
set role = 'admin', is_active = true
where id = (
  select id from auth.users where lower(email) = lower('YOUR_ADMIN_EMAIL')
);
```

Confirm the query updates exactly one row. If it updates zero rows, check that the Auth user exists and that the profile trigger created its `public.profiles` row. Do not promote a user you do not recognize. The normal sign-up/profile trigger assigns `staff`, not `admin`.

### 4. Run and check the app

```bash
npm run dev
```

Open the local URL printed by Vite. Sign in with the first admin account. A staff account should be denied access to this admin portal. Run these checks before committing:

```bash
npm run lint
npm run build
```

## Current scope and limitations

- This change adds the admin login gate, session persistence, active-account/role checks, and sign-out.
- The existing dashboard and member screens still use the project's current `GymContext` and sample/local-storage data. They have **not** yet been migrated to Supabase records. Do not treat the data screens as production-ready until that separate integration is completed.
- No sample gym members are inserted into Supabase.
- The staff portal will be a separate later task.
