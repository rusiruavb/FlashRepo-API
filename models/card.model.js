const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({

})

const Card = mongoose.model("cards", CardSchema);

module.exports = Card;