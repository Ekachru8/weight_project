# HomeFit

HomeFit is a state-of-the-art web application designed to help users track their fitness journey, including a 6-day workout split, diet macro targets, and weight progression. The application features a dynamic and modern glassmorphism UI with smooth animations and responsive design.

## Features

- **Dynamic Dashboard**: View today's workout, daily nutrition targets, and track progress with interactive visuals.
- **6-Day Workout Split**: Automatically calculated workout routine starting from registration day (Chest, Back, Legs, Shoulders, Arms, Core, Rest).
- **Diet & Macros**: Calorie and macronutrient calculation based on the Mifflin-St Jeor equation and user goals (Lose, Maintain, Gain) with built-in safety floors.
- **Progress Tracking**: Track weight over time using a dynamic area chart and view your longest streaks with a calendar heatmap.
- **Modern UI**: Dark-mode ready glassmorphism design, vibrant mesh gradients, hover states, and smooth micro-animations.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (via Prisma ORM)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database and run migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Seed the database with default exercises:
   ```bash
   npx tsx prisma/seed.ts
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

Run the test suite using Vitest:

```bash
npm run test
```

For test coverage:

```bash
npm run test:coverage
```
