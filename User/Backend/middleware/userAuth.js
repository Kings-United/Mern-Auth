import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log("token", token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Token Missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        req.user = decoded.id;
        // console.log("user", req.user);
        next();
    } catch (error) {
        console.error("JWT Auth Error: ", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token",
        });
    }
};