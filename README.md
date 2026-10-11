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
- Does not mutate saved financial state — purely preview

### Settings
- Customize display name and currency symbol
- 30-day challenge status overview
- Manage recurring commitments (mark paid/unpaid, add, delete)
- Reset all data to fresh demo state

### Analytics
- Detailed spending trends and category analysis

## Financial Calculations

- **Starting budget**: ₹10,000
- **Remaining balance**: starting budget + total income - total expenses
- **Safe-to-spend**: projected end-of-month balance / remaining days
- **Projected end balance**: current balance minus future subscription and commitment obligations
- **Health score** (0-100): based on spending rate vs. expected, projected balance, savings progress, unpaid commitments, and income-to-spending ratio
- **Risk level**: Low / Moderate / High / Critical based on health score and projected balance

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** build tool
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **localStorage** for client-side persistence (no server required)

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run typecheck # type checking
```

All data is stored locally in the browser under `pennypilot_state_v1`. No data is sent to any server.

## Design

Dark navy theme with lime-green accents. Fully responsive with mobile sidebar navigation. Consistent 8px spacing system, animated number transitions, and glassmorphism UI components.
