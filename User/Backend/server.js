import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
await connectDB();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to server!");
})

app.use('/user/auth', router)

app.listen(port, () => {
    console.log(`Server is connected to port ${port}`)
})