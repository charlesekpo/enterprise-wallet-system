import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }
        
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Database connected successfully');
    }catch(error){
        console.error('Error connecting to DB ', error);
        process.exit(1);
    }
}