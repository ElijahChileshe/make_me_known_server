const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require('dotenv').config();


const authMiddleware = async (req, res, next) => {
    try {
        // get token
        const token = req.header("Authorization").replace("Bearer ", "");

        console.log("token", token);
        
        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized, access denied"});
        }
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded", decoded);
        
        // find user
        const user = await User.findById(decoded.user_id).select("-password");
        if (!user) {
            return res.status(401).json({success: false, message: "Token invalid"});
        }
        req.user = user;

        console.log("found User", user);
        
        next();
    } catch (error) {
        res.status(401).json({success: false, message: "Unauthorized"});
    }
}

module.exports = authMiddleware;