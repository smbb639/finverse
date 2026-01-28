import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import expenseRouter from './routes/expense.route';
dotenv.config();
import dashboardRouter from './routes/dashboard.route';


const app: Application = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});


app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/expenses', expenseRouter);


export default app;
