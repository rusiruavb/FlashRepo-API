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
        res.status(200).json(card);
    } catch (error) {
        res.status(500).send({status: "Error with saving your card", error: error.message});
    }
})

router.get("/get", auth, async (req, res) => {
    try {
        const cards = await Card.find({userID: req.user.id});
        res.status(200).json(cards)
    } catch (error) {
        res.status(500).send({status: "Error with get all the cards", error: error.message});
    }
})

router.put("/update/:id", auth, async (req, res) => {
    try {
        const cardID = req.params.id;
        const {subName, lessonTopic, description, question, answer, date, status} = req.body;

        let card = await Card.findById(cardID);
        if (!card) {
            new Error("There is no card to update");
        }
        const updateCard = {
            userID: req.user.id,
            subjectName: subName,
            lessonName: lessonTopic,
            description: description,
            question: question,
            answer: answer,
            createDate: date,
            status: status
        }
        const updatedItem = await Card.findByIdAndUpdate(cardID, updateCard);
        res.status(200).send({status: "Card Updated successfully", card: updatedItem});
    } catch (error) {
        res.status(500).send({status: "Error with updating your flash card", error: error.message});
    }
})

router.put("/status/:id", auth, async (req, res) => {
    try {
        const cardID = req.params.id;
        const {status} = req.body;

        let card = await Card.findById(cardID);
        if (!card) {
            new Error("There is no card to update");
        }

        const updatedCard = await Card.findOneAndUpdate({_id: cardID}, {status: status}, {new: true, upsert: true});
        res.status(200).send({status: "Status set", card: updatedCard});
    } catch (error) {
        res.status(500).send({status: "Error with set status", error: error.message});
    }
})

router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const cardID = req.params.id;
        await Card.findByIdAndDelete(cardID);
        res.status(200).send({status: "Flash card deleted"});
    } catch (error) {
        res.status(500).send({status: "Error with deleting your card", error: error.message});
    }
})

module.exports = router;