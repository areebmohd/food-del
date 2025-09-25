import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://aashu9105628720_db_user:ashuashu777@cluster0.xugmxyb.mongodb.net/fooddel')
        console.log('DB connected successfully')
    } catch (error) {
        console.error('Database connection error:', error)
        process.exit(1)
    }
}