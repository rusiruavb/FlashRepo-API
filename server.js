const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const userRoutes = require("./routes/user.route");
const cardRouters = require("./routes/card.route");
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
    let html = fs.readFileSync("./views/document.html", "utf8");
    res.send(html)
})
app.use("/user", userRoutes);
app.use("/card", cardRouters);

app.listen(PORT, () => {
    console.log(`Server is up and running on port number ${PORT}`);
})
