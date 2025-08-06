import mongoose from "mongoose";

export const connectDB = async () => {
    const MongoDB_URI = 'mongodb+srv://expressexpress:express123@cluster0.xoxmqcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

    await mongoose.connect(MongoDB_URI).then(() => {
        console.log("Mongodb connected successfully");
    })
}