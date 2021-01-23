const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// @url - user/createacc
// @method - post
// @access - public
router.post("/createacc", async (req, res) => {
    const {name, email, password, school, field, profilePicture} = req.body;
    try {
        let user = await User.find({email});

        if (user) {
            new Error("User account already exists");
        }

        user = {name, email, password, profilePicture, school, field };
        const newUser = new User(user);

        const createdUser = await newUser.save();
        const token = await newUser.generateAuthToken();

        const data = {
          createdUser,
          token
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).send({status: "Error with creating account", error: error.message});
    }
})

// @url - user/getacc
// @method - get
// @access - private
router.get("/getacc", auth, async (req, res) => {
    try {
        const data = req.user;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).send({status: "Error with getting user data", error: error.message});
    }
})

// @url - user/updateacc
// @method - put
// @access - private
router.put("/updateacc", auth, async(req, res) => {
    const {name, email, password, school, field, profilePicture} = req.body;
    let user = await User.find({email});
    if (!user) {
        throw new Error("There is no user in the system. Please check the email!");
    }
    const hashPassword = await bcrypt.hash(password, 8);
    user = {name, email, password: hashPassword, profilePicture, school, field};
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, user);
        res.status(200).send({status: "Your profile data updated successfully!", user: updatedUser});
    } catch (error) {
        res.status(500).send({status: "Error with update your data", error: error.message})
    }
})

// @url - user/deleteacc
// @method - delete
// @access - private
router.delete("/deleteacc", auth, async (req, res) => {
    let user = await User.find({email: req.user.email});
    if (!user) {
        throw new Error("There is no user to delete. Please check the email");
    }
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        res.status(201).send({status: "Your account deleted successfully"});
    } catch (error) {
        res.status(500).send({status: "Error with delete your account", error: error.message});
    }
})

// @url - user/login
// @method - post
// @access - public
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        const sendData = {
          user,
          token
        }
        res.status(200).json(sendData);
    } catch (error) {
        res.status(500).send({status: "Error with login", error: error.message});
    }
})

// @url - user/logout
// @method - post
// @access - private
router.post("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send({status: "Logout successfully!"});
    } catch (error) {
        res.status(500).send({status: "Error with logout", error: error.message});
    }
})

module.exports = router;
