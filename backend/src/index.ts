import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT;

async function connection() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}/api/dashboard`);
    console.log(`Auth endpoints at http://localhost:${PORT}/api/auth`);
    console.log(`Expense endpoints at http://localhost:${PORT}/api/expenses`);
    
  });
}

connection();
