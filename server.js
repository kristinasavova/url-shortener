const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

// mongoose.connect(process.env.DB_URI);

app.use(cors());

// Parse POST bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", (req, res) => {
    res.json({greeting: 'hello API'});
});

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});