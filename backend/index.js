require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter = require('./src/routes/auth');
const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    console.log("Hello World");
    res.send("Hello World, API is running!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
