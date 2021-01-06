const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    lessonName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    createDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        required: true,
        trim: true
    }
})

const Card = mongoose.model("cards", CardSchema);

module.exports = Card;