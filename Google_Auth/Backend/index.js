import express from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/route.js";
import { connectDB } from "./utils/mongoDB.js";
import cors from "cors";


const app = express();
const port = process.env.PORT || 8080;

// console.log(port);
// console.log(process.env.GOOGLE_CLIENT_ID);
// console.log(process.env.GOOGLE_CLIENT_SECRET);

app.get('/', (req, res) => {
    res.send("Welcome to server!");
})

app.use(cors());
connectDB();
app.use('/auth', router)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})