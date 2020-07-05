const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
require('dotenv').config(); // access to the .env variables

const app = express();
const { PORT, MONGO_NAME, MONGO_KEY} = process.env;

// Basic Configuration 
const port = PORT;

// Connect to the MongoDB server 
mongoose.connect(`mongodb+srv://${MONGO_NAME}:${MONGO_KEY}@ks-ujl29.mongodb.net/url?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; 

db.on('error', err => console.error(err));
db.once('open', () => console.log('Database is connected'));

app.use(cors());

// Parse POST bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/static', express.static('public'));

app.use('/api', routes); 

/** 
 * GET '/' and show a home page
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// 404 Route 
app.use((req, res, next) => {
    const err = new Error('Not Found!');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    console.log(err); 
    res.status(err.status || 500);
    res.json({ error: err.message }); 
});

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});