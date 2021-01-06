const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const decode = jwt.verify(token, "flash_private_key");
        const user = await User.findOne({ _id: decode._id, "tokens.token": token });
        if (!user) {
            throw new Error("Please Authenticated");
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: error.message });
        console.log("Error in auth.js middleware ", error.message);
    }
};

module.exports = auth;