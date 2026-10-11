# PennyPilot

A 30-day money management app built for the Gen Z hackathon. Start with ₹10,000 and manage your finances across a simulated month — track income and expenses, set budgets, save toward goals, manage subscriptions and commitments, and get AI-driven financial coaching.

## Features

### Dashboard
- **Available Balance** hero card with safe-to-spend daily rate and financial health score
- **Balance Forecast** chart projecting your end-of-month balance
- **Spending by Category** pie chart breakdown
- **Savings Goals** progress overview
- **Recent Transactions** list
- **Smart Money Coach** with personalized insights (overdraft warnings, overspending alerts, savings tips)

### Transactions
- Full CRUD: add, edit, delete transactions
- Filter by category, type (income/expense), and search by description
- Income and expense types with 11 categories including Unexpected expenses

### Budgets
- Set per-category spending limits
- Visual progress bars with safe/warning/over status
- Summary stats: total budget, total spent, over-budget count

### Savings Goals
- Create goals with custom names, target amounts, colors, and icons
- Contribute money toward goals (auto-creates an expense transaction)
- Visual progress tracking with completion state

### Subscriptions
- Track recurring monthly charges with billing day
- Pause/resume subscriptions
- Monthly and yearly cost summaries

### What-if Simulator
- Adjust spending reduction, extra income, and additional savings via sliders
- Preset scenarios (cut 20% spending, earn extra, save more, aggressive saver)
- Real-time projection of month-end balance, health score, savings, and safe-to-spend
- Clear forecast explanation showing how projections are calculated
- Does not mutate saved financial state — purely preview

### Settings
- Customize display name and currency symbol
- 30-day challenge status overview
- Manage recurring commitments (mark paid/unpaid, add, delete)
- Reset all data to fresh demo state

### Analytics
- Daily spending and income bar chart
- Category distribution pie chart
- Income vs expense comparison
- Budget utilization radial chart
- Top spending categories ranked list

## Financial Calculations

- **Starting budget**: ₹10,000
- **Remaining balance**: starting budget + total income - total expenses
- **Safe-to-spend**: projected end-of-month balance / remaining days
- **Projected end balance**: current balance minus future subscription and commitment obligations
- **Health score** (0-100): based on spending rate vs. expected, projected balance, savings progress, unpaid commitments, and income-to-spending ratio
- **Risk level**: Low / Moderate / High / Critical based on health score and projected balance

### Simulator Formula

The What-if Simulator applies three adjustments to your current financial state:

1. **Spending reduction** — cuts your total spending by the chosen percentage, adding the savings back to your balance
2. **Extra income** — adds a one-time income amount to your balance
3. **Extra savings** — moves money from your balance to savings goals (reduces balance but increases savings progress)

The projected end-of-month balance is then recalculated by applying future subscription billing and unpaid commitments between the current day and day 30, using the same forecast model as the dashboard.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** build tool with manual chunk splitting for optimal loading
- **Tailwind CSS 3** for styling
- **Recharts 3** for data visualization
- **Lucide React** for icons
- **localStorage** for client-side persistence (no server required)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Commands

```bash
npm install        # install dependencies
npm run build      # production build to dist/
npm run preview    # preview production build locally
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint
```

All data is stored locally in the browser under `pennypilot_state_v1`. No data is sent to any server.

## Architecture

### Project Structure

```
src/
├── App.tsx                    # Root component with lazy-loaded page routing
├── main.tsx                   # React entry point
├── index.css                  # Tailwind + custom component styles
├── context/
│   ├── FinanceContext.tsx     # Global state provider (React Context)
│   ├── useFinance.ts          # useFinance hook (separate for fast-refresh compat)
│   └── types.ts               # Context value type definition
├── lib/
│   ├── finance.ts             # Financial calculations, metrics, insights, simulator
│   ├── storage.ts             # localStorage persistence + demo data generators
│   ├── chartTheme.ts          # Recharts shared styling constants
│   └── icons.ts               # Lucide icon name-to-component mapper
├── types/
│   └── index.ts               # TypeScript types + category metadata
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        # Navigation sidebar with challenge progress
│   │   └── TopBar.tsx         # Sticky header with balance, risk, notifications
│   └── ui/
│       ├── AnimatedNumber.tsx # Number transition animation component
│       ├── Card.tsx           # Card + CardHeader primitives
│       ├── ConfirmDialog.tsx  # Delete confirmation modal
│       ├── EmptyState.tsx     # Empty state placeholder
│       ├── Modal.tsx          # Accessible modal dialog (focus trap, ESC close)
│       ├── NotificationPanel.tsx # Dropdown notification panel
│       ├── PageHeader.tsx     # Page title + subtitle + action slot
│       └── RiskBadge.tsx      # Risk level badge + progress bar
└── pages/
    ├── Dashboard.tsx          # Overview with balance, forecast, insights
    ├── Transactions.tsx       # Transaction list with CRUD + filtering
    ├── Budgets.tsx            # Per-category budget limits
    ├── SavingsGoals.tsx       # Goal tracking with contributions
    ├── Subscriptions.tsx      # Recurring subscription management
    ├── WhatIfSimulator.tsx    # Interactive financial scenario simulator
    ├── Analytics.tsx          # Detailed charts and spending analysis
    └── Settings.tsx           # Profile, commitments, data management
```

### State Management

All app state lives in a single `FinanceState` object managed by `FinanceContext` via React Context API. State changes are persisted to `localStorage` on every update through a `useEffect` watcher. The `useFinance` hook is extracted into its own file for React Fast Refresh compatibility, and provides typed access to state, derived metrics, and mutation functions.

### Performance

- **Lazy loading**: All pages except Dashboard are lazy-loaded with `React.lazy` + `Suspense`
- **Code splitting**: Vite manual chunks separate recharts, lucide-react, and vendor code into independent bundles
- **Memoization**: Financial metrics are computed via `useMemo` keyed on state and current day; context callbacks use `useCallback`
- **AnimatedNumber**: Uses `requestAnimationFrame` with cleanup for smooth number transitions

### Accessibility

- Full keyboard navigation support (ESC to close modals, focus management)
- ARIA labels on icon-only buttons, sliders with `aria-valuetext`, progress bars with `aria-valuenow`
- `aria-current="page"` on active nav items
- `role="list"` and `role="listitem"` on transaction and insight lists
- Decorative icons marked `aria-hidden="true"`
- Focus-visible outlines on interactive elements
- Mobile touch targets meet 36px minimum

## Design

Dark navy theme with lime-green accents. Fully responsive with mobile sidebar navigation. Consistent 8px spacing system, animated number transitions, and glassmorphism UI components. Custom CSS utilities for glass effects, gradient text, and staggered animations.
