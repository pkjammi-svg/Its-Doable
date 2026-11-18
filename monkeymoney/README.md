# MonkeyMoney 🐒🍌

A gamified budgeting app for students. Track spending, build streaks, earn bananas, and learn money basics — all offline-capable as a PWA.

## Tech stack

- **React 18 + Vite + TypeScript** — fast build and dev experience
- **Tailwind CSS** — jungle green + banana yellow theme, dark mode, mobile-first
- **Recharts** — donut and bar charts
- **Dexie (IndexedDB)** — all data stored locally, works offline
- **vite-plugin-pwa** — installable PWA, service worker, add-to-home-screen
- **React Router** (hash routing for GitHub Pages compatibility)
- **Vitest** — unit tests for all gamification logic

## Setup

```bash
cd monkeymoney
npm install
```

## Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Run tests

```bash
npm test
```

Tests cover: daily/weekly streak logic, gamification points, level thresholds, badge triggers, red-zone percentages, monthly comparison, and edge cases (empty data, month boundaries, deleted expenses, mid-month cap).

## Build for production

```bash
npm run build
```

Output is in `dist/`.

## Deploy to GitHub Pages

The included `.github/workflows/deploy.yml` workflow:
1. Runs on pushes to `main` / `master` that touch `monkeymoney/`
2. Installs dependencies and runs tests
3. Builds with `GITHUB_ACTIONS=true` (sets base URL to `/its-doable/`)
4. Deploys `dist/` to GitHub Pages

**To enable:** Go to your repo → Settings → Pages → Source: "GitHub Actions".

The app will be available at `https://<username>.github.io/its-doable/`.

## Features

### Budget layer
- Multiple income sources with currency selector (₹ default, Indian number formatting)
- Fast expense logging with category chips
- Monthly spending limit (auto = total income, or override)
- Dashboard: hero spending meter with monkey mascot, donut chart by category
- Monthly comparison: 6-month bar chart, this-vs-last-month category table
- Red-zone alerts at 70% (amber) and 85% (red) with actionable options

### Gamification
- Daily streaks (consecutive green days ≤ daily limit)
- Weekly streaks (Mon–Sun weeks under budget)
- Bananas: 10/green day, 25/green week, 20/lesson
- 6 levels from Baby Monkey to Silverback Saver (every 150 bananas)
- 7 badges for milestones
- No-spend day button (logs ₹0, keeps streak alive)

### Learn money (12 lessons)
- Short, plain-language lessons on budgeting, investing, inflation, scams
- 3-option quiz per lesson; correct answer awards bananas
- Compound growth calculator with 4/8/12% examples
- Persistent disclaimer: learning only, not financial advice

### Data & PWA
- All data in IndexedDB — no server, fully offline
- JSON export/import for backup
- Sample data loader (3 months of realistic spending)
- Installable as a PWA on Android/iOS/desktop
