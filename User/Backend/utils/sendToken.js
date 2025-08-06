import jwt from 'jsonwebtoken';

export const sendToken = (user, res, message, statusCode = 200) => {

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
        maxAge: 24 * 60 * 60 * 1000
    })

    const { password, ...safeUser } = user.toObject();

    return res.status(statusCode).json({
        success: true,
        message,
        user: safeUser,
    })
}