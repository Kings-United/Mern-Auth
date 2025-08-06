import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyOtp, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();// Create a new router instance for authentication routes

authRouter.post('/register', register); // Define the route for user registration
authRouter.post('/login', login); // Define the route for user login
authRouter.post('/logout', logout); // Define the route for user logout
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp); // Define the route for user logout
authRouter.post('/verify-account', userAuth, verifyOtp); // Define the route for user logout
authRouter.post('/is-auth', userAuth, isAuthenticated); // Define the route to check if the user is authenticated
authRouter.post('/send-reset-otp', sendResetOtp); // Define the route to send a reset OTP
authRouter.post('/reset-password', resetPassword);  // Define the route to reset the user's password



export default authRouter; // Export the authentication router for use in other files