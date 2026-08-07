import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import walletRoutes from "./routes/wallet.routes";
import errorHandler from "./middleware/error.middleware";
import transactionRoutes from "./routes/transaction.routes";

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));
app.use(indexRoutes);

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);


export default app;