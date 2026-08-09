import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import walletRoutes from "./routes/wallet.routes";
import errorHandler from "./middleware/error.middleware";
import transactionRoutes from "./routes/transaction.routes";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // so this origin should be allowed to send cookie
}));

app.use(express.json());

app.use(cookieParser());

app.use(indexRoutes);

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);


export default app;