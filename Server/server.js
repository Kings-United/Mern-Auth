import express from 'express'; // Import the Express framework
import cors from 'cors'; // Import CORS middleware
import 'dotenv/config'; // Import environment variables/
import cookieParser from 'cookie-parser'; // Import cookie parser middleware
import connectDB from './config/mongodb.js';// Import custom MongoDB connection function
import authRouter from './routes/authRoutes.js'; // Import authentication routes
import userRouter from './routes/userRoutes.js';



const app = express(); // Create an Express application
const port = process.env.PORT || 5000; // Set the port from environment variables or default to 5000
connectDB(); // Connect to MongoDB using the custom function


app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({ credentials: true })); // Enable CORS with credentials

// API ENDPOINTS
app.get('/', (req, res) => { // Define a route for the root URL
    res.send('Welcome to the server!'); // Respond with a welcome message
})
app.use('/api/auth', authRouter);// Use the authentication routes for the '/api/auth' endpoint
app.use('/api/auth', userRouter);// Use the authentication routes for the '/api/auth' endpoint


app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // Log the server start message
})

