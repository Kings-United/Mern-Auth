import axios from "axios";
import googleConfig from "../utils/googleConfig.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await googleConfig.getToken(code); //oauth2client
        googleConfig.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { name, email, picture } = userRes.data;

        const user = await User.findOne({ email });

        if (!user) {
            const user = await User.create({
                name,
                email,
                image: picture
            })
        }

        const { _id } = user;

        const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        return res.status(200).json({
            message: "Success",
            token,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// export const googleLogin = async (req, res) => {
//     try {
//         const { code } = req.query;
//         const googleRes = await googleConfig.getToken(code);
//         googleConfig.setCredentials(googleRes.tokens);

//         const userRes = await axios.get(
//             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
//         );

//         const { name, email, picture } = userRes.data;

//         let user = await User.findOne({ email });

//         if (!user) {
//             user = await User.create({
//                 name,
//                 email,
//                 image: picture
//             });
//         }

//         if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
//             throw new Error("JWT configuration missing");
//         }

//         const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRE
//         });

//         return res.status(200).json({
//             message: "Success",
//             token,
//             user
//         });
//     } catch (error) {
//         console.error("Google OAuth Error:", error.response?.data || error.message);
//         return res.status(500).json({ message: error.message });
//     }
// };