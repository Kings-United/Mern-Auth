import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const token = req.cookies; // Get the token from cookies
    // console.log("Token:", token);

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" }); // If no token, respond with unauthorized
    }

    try {
        const decoded = jwt.verify(token.token, process.env.JWT_SECRET); // Verify the token using the secret key
        // console.log("Decoded Token:", decoded);
        if (!decoded.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
            // Attach user ID to the request body if available
        }
        if (!req.body) {
            req.body = {};
        }

        req.body.userId = decoded.id;
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(403).json({ success: false, message: error.message }); // If token verification fails, respond with forbidden
    }
}


export default userAuth; // Export the userAuth middleware for use in other files   