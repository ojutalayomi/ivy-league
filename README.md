# Ivy League Associates Portal

A modern web application for student and admin management, built with **React**, **TypeScript**, **Vite**, and **Ant Design**. The portal supports student registration, paper/course management, payments, and admin oversight, with a clean, responsive UI and robust state management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Key Components & Pages](#key-components--pages)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Customization](#customization)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Student Registration & Authentication**: Sign up, sign in, password reset, and email verification.
- **Paper/Course Registration**: Students can register for papers/courses, view fees, and see available discounts.
- **Payment Integration**: Initiate and track payments, with support for partial and full payments.
- **Admin Dashboard**: Manage students, view registrations, and oversee platform activity.
- **Responsive UI**: Clean, modern design with dark mode support.
- **Reusable UI Components**: Built with a custom component library and Ant Design.
- **Notifications & Toasts**: User feedback for actions and errors.
- **Role-based Navigation**: Separate flows for students and admins.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Ant Design, custom components, Tailwind CSS
- **State Management**: Redux Toolkit
- **API**: Axios for HTTP requests
- **Date Handling**: dayjs
- **Utilities**: react-hook-form, lucide-react (icons)
- **Testing**: (Add your testing framework here if used)

---

## Project Structure

```
ivy-league/
  public/
  src/
    assets/           # Images and static assets
    components/       # Reusable UI components (including ui/ subfolder)
    hooks/            # Custom React hooks
    lib/              # API, types, utilities, and data
    pages/            # Main app pages (student/, admin/, auth, etc.)
    providers/        # Context providers
    redux/            # Redux store and slices
  index.html
  package.json
  tailwind.config.ts
  tsconfig.json
  vite.config.ts
  README.md
```

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Available Scripts

- `npm run dev` — Start the development server with hot reloading.
- `npm run build` — Build the app for production.
- `npm run preview` — Preview the production build locally.
- `npm run lint` — Run ESLint on the codebase.

---

## Key Components & Pages

- **Authentication**: `src/pages/SignIn.tsx`, `SignUp.tsx`, `ResetPassword.tsx`, `VerifyEmail.tsx`
- **Student Dashboard**: `src/pages/student/Dashboard.tsx`
- **Paper Registration**: `src/pages/student/PapersRegistration.tsx`
- **Admin Management**: `src/pages/admin/ManageStudents.tsx`
- **Reusable UI**: `src/components/ui/` (buttons, tables, dialogs, calendar, etc.)
- **Signup Steps**: `src/components/signup-steps.tsx` (multi-step registration with Ant Design DatePicker)

---

## State Management

- **Redux Toolkit** is used for global state (user, payment, utils).
- Store setup: `src/redux/store.ts`
- Slices: `userSlice.ts`, `paymentSlice.ts`, `utilsSlice.ts`

---

## API Integration

- **Axios** is used for HTTP requests.
- API logic: `src/lib/api.ts`
- Types: `src/lib/types.ts`
- Data and helpers: `src/lib/data.ts`, `src/lib/utils.ts`

---

## Customization

- **Theming**: Tailwind CSS and Ant Design for easy customization.
- **Dark Mode**: Toggle via `mode-toggle.tsx`.
- **Component Library**: Extend or modify components in `src/components/ui/`.

---

## Environment Setup

- Copy `.env.local.example` to `.env.local` and fill in required environment variables (API keys, endpoints, etc.).
- (Add any other environment setup instructions here.)

---

## Deployment

- Build the app with `npm run build`.
- Deploy the contents of the `dist/` folder to your preferred hosting provider (Vercel, Netlify, etc.).
- (Add any provider-specific deployment steps here.)

---

## License

[MIT](LICENSE) (or your license here)

---

**For more details, see the code comments and individual component documentation.**
