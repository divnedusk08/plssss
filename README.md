# HourTrackr NJHS

A web application for NJHS members to track and submit their volunteer hours.

## Features

- Google Sign-In authentication
- Volunteer hour submission form
- User dashboard with submission history
- Admin view for managing all submissions
- Export functionality for reports

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Supabase
- Authentication: Google Sign-In via Supabase

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── types/         # TypeScript type definitions
└── context/       # React context providers
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 