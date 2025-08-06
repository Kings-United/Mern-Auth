import bcrypt from 'bcryptjs'; // Import bcrypt for hashing passwords
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for generating JWT tokens
import userModel from '../models/UserModel.js'; // Import the user model for database operations
import transporter from '../config/nodemailer.js'; // Import the nodemailer transporter for sending emails


// This function handles user registration by checking if the user already exists, hashing the password, and saving the user to the database.
// It also generates a JWT token and sets it in a cookie for authentication purposes.
export const register = async (req, res) => {

    const { name, email, password } = req.body; // Destructure the request body to get name, email, and password

    // Check if all required fields are provided
    if (!name || !email || !password) {
        return res.json({
            sucess: false,
            message: "Please fill all the fields"
        })
    }

    // Check if the user already exists
    try {

        const existingUser = await userModel.findOne({ email }); // Find a user by email in the database

        // If the user already exists, return a response indicating that
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10

        // Create a new user instance with the provided name, email, and hashed password
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save(); // Save the new user to the database

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Generate a JWT token with the user's ID and a secret key, valid for 7 days

        // Set the token in a cookie with HTTP-only, secure, and SameSite attributes
        res.cookie('token', token, {
            httpOnly: true, // Set the cookie to be HTTP-only
            secure: process.env.NODE_ENV === 'production', // Set the cookie to be secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Set the SameSite attribute based on the environment
            maxAge: 7 * 24 * 60 * 60 * 1000 // Set the cookie to expire in 7 days   
        });

        const registerMail = {
            from: process.env.SMTP_EMAIL, // Sender address
            to: email,
            subject: "Welcome to Demo Login", // Subject line
            text: `Welcome And thank you for choosing our services.Your account has been created with email id : ${email}`, // plain‑text body
            // html: "<b>Hello world?</b>", // HTML body
        }

        try {
            await transporter.sendMail(registerMail); // Send the welcome email using the transporter
        } catch (error) {
            console.error("Error sending registration email:", error); // Log any errors that occur while sending the email
        }

        // Respond with a success message
        return res.json({
            success: true,
            message: "Registration successful"
        })

    } catch (error) {
        // If an error occurs, respond with a failure message
        res.json({
            success: false,
            message: error.message
        })
    }
}


// This function handles user login by checking if the user exists, validating the password, and generating a JWT token.
// It also sets the token in a cookie for authentication purposes.
export const login = async (req, res) => {
    const { email, password } = req.body; // Destructure the request body to get email and password

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Please fill all the fields"
        })
    }

    try {
        const user = await userModel.findOne({ email }); // Find a user by email in the database

        // If the user does not exist, return a response indicating that
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database

        // If the password is invalid, return a response indicating that
        if (!isPasswordValid) {
            return res.json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Generate a JWT token with the user's ID and a secret key, valid for 7 days

        res.cookie('token', token, {
            httpOnly: true, // Set the cookie to be HTTP-only
            secure: process.env.NODE_ENV === 'production', // Set the cookie to be secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Set the SameSite attribute based on the environment
            maxAge: 7 * 24 * 60 * 60 * 1000 // Set the cookie to expire in 7 days
        });

        // Respond with a success message
        return res.json({
            success: true,
            message: "Login successful"
        })

    } catch (error) {
        // If an error occurs, respond with a failure message
        response.json({
            success: false,
            message: error.message
        })
    }
}


// This function handles user logout by clearing the 'token' cookie and responding with a success message.  
export const logout = async (req, res) => {

    try {
        // Clear the 'token' cookie by setting its value to an empty string and maxage to 0
        // This effectively removes the cookie from the user's browser  
        res.clearCookie('token', {
            httpOnly: true, // Set the cookie to be HTTP-only
            secure: process.env.NODE_ENV === 'production', // Set the cookie to be secure in production
            sameSite: process.env.NODE_ENV === ' production' ? 'none' : 'strict', // Set the SameSite attribute based on the environment
        });

        // Respond with a success message indicating that the logout was successful
        return res.json({
            success: true,
            message: "LogOut Successful"
        })

    } catch (error) {
        // If an error occurs, respond with a failure message
        res.json({
            success: false,
            message: error.message
        })
    }
}

// This function sends a verification OTP to the user's email for account verification.
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account already verified"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP
        const verifyOtp = otp;
        const verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // Set OTP expiration time to 24 hours from now

        user.verifyOtp = verifyOtp; // Set the OTP in the user document
        user.verifyOtpExpireAt = verifyOtpExpireAt; // Set the OTP expiration time in the user document
        user.isAccountVerified = false; // Ensure the account is not verified yet
        await user.save();

        const mailOption = {
            from: process.env.SMTP_EMAIL, // Sender address
            to: user.email,
            subject: "Account verification OTP", // Subject line
            text: `Your OTP is ${otp}. Verify your account using this OTP.`, // plain‑text body

        }

        await transporter.sendMail(mailOption); // Send the verification email using the transporter

        return res.json({
            success: true,
            message: "OTP sent successfully",
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

// This function verifies the OTP provided by the user for account verification.
export const verifyOtp = async (req, res) => {

    const { userId, otp } = req.body; // Destructure the request body to get userId and otp
    console.log("UserId:", userId, "OTP:", otp); // Log the userId and otp for debugging

    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "Please provide userId and OTP"
        });
    }

    try {

        const user = await userModel.findById(userId); // Find the user by userId in the database
        // If the user does not exist, return a response indicating that User not found
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Check if the OTP is valid or not 
        if (user.verifyOtp !== otp || user.verifyOtp == '') {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check if the OTP has expired
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired"
            });
        }

        user.isAccountVerified = true; // Set the account as verified
        user.verifyOtp = ''; // Clear the OTP after successful verification
        user.verifyOtpExpireAt = 0; // Clear the OTP expiration time


        await user.save(); // Save the updated user document

        return res.json({
            success: true,
            message: "Account verified successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// This function checks if the user is authenticated by verifying the JWT token in the request.
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: "User is authenticated"
        })

    } catch (error) {
        return res.json({
            sucess: false,
            message: error.message
        })
    }
}

// This function sends a password reset OTP to the user's email for resetting their password.
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res({
            success: false,
            message: "Please provide email"
        })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                succcess: false,
                message: "User not found"
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const resetOtp = otp;
        const resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

        user.resetOtp = resetOtp;
        user.reserOtpExpiryAt = resetOtpExpireAt;
        await user.save();

        const mailOption = {
            from: process.env.SMTP_EMAIL, // Sender address
            to: email,
            subject: "Password Reset OTP", // Subject line
            text: `Your OTP for password reset is ${otp}. Use this OTP to reset your password.`, // plain‑text body
        }

        await transporter.sendMail(mailOption);

        return res.json({
            success: true,
            message: "Otp sent successfully"
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }

}

// This function resets the user's password using the provided OTP and new password.
export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        return res.json({
            success: false,
            message: "Please provide email, OTP, and new Password"
        })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        if (user.resetOtp !== otp || user.rresetOtp === '') {
            return res.json({
                success: false,
                message: "Invalid OTP"
            })
        }

        if (user.resetOtpExpiryAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP expired"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0;
        await user.save();

        return res.json({
            success: true,
            message: "Password reset successfully"
        })




    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}