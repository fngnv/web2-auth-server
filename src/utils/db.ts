import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoConnect = async () => {
    const connection = await mongoose.connect(process.env.DATABASE_URL as string);
    console.log('Database connected');
    return connection;
};

export default mongoConnect;