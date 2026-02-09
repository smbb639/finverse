# 🌌 Finverse 

> **Status:**  **Under Active Development (Beta)**
> This project is currently in a high-velocity development phase. New features are being rolled out frequently.

---

## ✨ Key Features

###  Intelligence Dashboard
- **Market Snapshot**: Real-time tracking of major Indian indices (NIFTY 50, SENSEX, Bank NIFTY) via a professional hover-interface.
- **KPI Overview**: Dynamic visualization of monthly budget performance, total spent, and remaining balance.
- **Smart Category Breakdown**: Interactive donut charts allowing users to drill down into expenses by period (Daily, Weekly, Monthly, or Current Month).

###  Expense Management
- **Full CRUD Support**: Add, edit, and delete expenses with ease.
- **Categorization**: Automatic and custom categorization (Food, Bills, Investments, Entertainment, etc.).
- **Budget Tracking**: Visual progress bars that intelligently alert users when they exceed their spending limits.

###  Investment Portfolio
- **Wealth Tracking**: Holistic view of invested capital vs. current market value.
- **P&L Analysis**: Real-time Profit and Loss calculations and percentage shifts.
- **Financial News**: Integrated news feed tailored to market movements and portfolio context.

###  Security & Auth
- **JWT-based Authentication**: Secure user registration and login.
- **Protected API Routes**: Backend middleware ensuring data privacy and individual user scope.

---

##  Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Next.js (App Router), Tailwind CSS, Framer Motion |
| **Charts** | Recharts (Premium custom-styled implementations) |
| **State/Data** | TanStack Query (React Query) v5, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- NPM or PNPM

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/finverse.git
   cd finverse
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file (NEXT_API_URL=http://localhost:3000/api)
   npm run dev
   ```

---

##  API Overview (Backend)

The API is built following RESTful principles and serves all data in JSON format.

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate and receive JWT

### Dashboard & Analytics
- `GET /api/dashboard` - Get full dashboard summary
- `GET /api/dashboard/quick-stats` - Get daily/weekly comparison stats
- `GET /api/dashboard/category-breakdown` - Get period-specific category data

### Market Data
- `GET /api/market/snapshot` - Fetch real-time market indices updates

### Financial Data
- `GET /api/expenses` - Retrieve all user expenses
- `POST /api/expenses` - Log a new transaction
- `GET /api/investment/portfolio` - Fetch current portfolio performance

---

##  Contributing
Since this is an ongoing project, contributions are welcome! Please feel free to open issues or submit pull requests.

##  License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Finverse - Navigating your financial future with precision.*
