const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user.route");
const PORT = process.env.PORT || 8102;

app.use(cors());
app.use(bodyParser.json());

const URI = process.env.MONGODB_URI;

mongoose.connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.once('open', () => {
    console.log('MongoDB connection successful');
})

// use defined routes
app.get("/", (req, res) => {
    res.send("Flashcard API Running...<br/><a href='https://github.com/rusiruavb/FlashRepo.git'>Read the Documentation</a>")
})
app.use("/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is up and running on port number ${PORT}`);
})
