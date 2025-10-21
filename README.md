# Beeeers 🍺

A modern brewing companion web app for creating, managing, and refining beer recipes with accurate brewing calculations and detailed brew session logging.

## Features

- **Recipe Management**: Create and edit beer recipes with automatic calculations
- **Brewing Calculations**: Accurate OG, FG, ABV, IBU, and SRM calculations using industry-standard formulas
- **Brew Logs**: Track brewing sessions with gravity readings, fermentation notes, and outcomes
- **Water Chemistry**: Calculate ion profiles and salt additions for optimal water treatment
- **Clean UI**: Modern, Attio-inspired interface built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **UI**: shadcn/ui + Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd beeeers
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your database credentials
```

4. Set up the database:

```bash
# Generate migrations
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit push

# Seed ingredients
pnpm tsx src/db/seed.ts
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Brewing Calculations

The app implements industry-standard brewing calculations:

- **Gravity**: Palmer's mass-gravity-volume formula with PKL (Points per kg per L)
- **IBU**: Tinseth formula with whirlpool and utilization adjustments
- **Color**: SRM calculation using Morey equation
- **ABV**: Standard alcohol calculation
- **Priming**: CO₂ volume calculations for carbonation
- **Water**: Ion profile estimation for water chemistry

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── recipes/           # Recipe management pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── RecipeStatsBar.tsx # Custom components
├── db/                   # Database schema and connection
├── lib/                  # Utilities and calculations
│   ├── calc/             # Brewing calculation functions
│   └── validations.ts    # Zod schemas
└── hooks/                # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
