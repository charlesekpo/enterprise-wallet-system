import express from "express";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import walletRoutes from "./routes/wallet.routes";

const app = express();

app.use(express.json());
app.use(indexRoutes);

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);


export default app;