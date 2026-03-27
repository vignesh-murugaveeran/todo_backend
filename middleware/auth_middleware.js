const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        //check token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(" ")[1];

        //Verify access token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        //Attach  user data
        req.user = decoded;

        next(); //go to controller
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;