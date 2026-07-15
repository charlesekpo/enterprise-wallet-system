import "dotenv/config";
import { connectDB } from "./config/db";

import app from "./app";

const PORT = process.env.PORT || 5000;

const startServer = async()=>{
    connectDB();

    app.listen(PORT, ()=>{
        console.log(`Server is running on localhost:${PORT}`);
    });

}

startServer();

