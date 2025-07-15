// @ts-nocheck
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MogoDB connected successfully.');
        
    } catch (error) {
        console.error("MongoDB connection Error:", error);
        
        process.exit(1)
    }
}

export {dbConnect};