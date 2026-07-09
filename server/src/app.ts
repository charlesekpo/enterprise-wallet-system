import express from "express";
import indexRoutes from "./routes/index.routes";
import loginRoutes from "./routes/auth.routes";
import registerRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(indexRoutes);

app.use('/auth', loginRoutes);
app.use('/auth', registerRoutes);


export default app;