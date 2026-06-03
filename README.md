# GymFit

A full-stack web application built to manage gym workouts and classes. Regular users can browse and filter available sessions, while administrators can add or delete workouts directly from the interface.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, jwt-decode
- **Backend:** ASP.NET Core Web API, EF Core
- **Database:** PostgreSQL

## Application Preview

### Workout Library (User View)
*Main interface featuring dynamic filtering and a live search bar.*
![Workout Library](./screenshots/library.png)

### Control Panel (Admin View)
*Admin privileges (+ Add Workout button and delete icons) appear only when logged in with an Admin role.*
![Admin View](./screenshots/admin_view.png)

## Features

- **Authentication System:** Secure login and registration with hashed passwords handled via ASP.NET Core Identity.
- **Role-Based UI Control:** The frontend dynamically adapts and toggles component visibility based on the JWT claims received at login.
- **Live Filtering:** Quick search engine for sport classes based on string matching and specific fitness categories (Strength, Endurance, Flexibility).
- **Relational Database:** Interconnected PostgreSQL tables managed through Entity Framework Core migrations.

## Roadmap / Upcoming Features

- [ ] **User Bookings:** Allow regular users to book a slot for specific workout sessions.
- [ ] **User Profiles:** Dedicated dashboard for users to track their enrolled classes and personal fitness stats.
- [ ] **Payment Integration:** Mock checkout system for gym memberships.

## Getting Started (Local Setup)

### 1. Backend
1. Navigate to `backend/GymFitApi`.
2. Update your PostgreSQL connection string in `appsettings.json`.
3. Open your terminal and run:
   ```bash
   dotnet ef database update
   dotnet run
