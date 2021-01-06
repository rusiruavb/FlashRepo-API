const express = require("express");
const router = express.Router();
const Card = require("../models/card.model");
const User = require("../models/user.model");
const auth = require("../middleware/auth.middleware");

router.post("/create", auth, async (req, res) => {
    const {subName, lessonTopic, description, question, answer, status} = req.body;
    try {
        const newCard = {
            userID: req.user.id,
            subjectName: subName,
            lessonName: lessonTopic,
            description: description,
            question: question,
            answer: answer,
            createDate: new Date(),
            status: status
        }

        const card = new Card(newCard);
        await card.save();
        res.status(200).send({staus: "Flashcard Added to your list", card: card});
    } catch (error) {
        res.status(500).send({status: "Error with saving your card", error: error.message});
    }
})

module.exports = router;