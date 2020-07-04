const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

// Connect to the MongoDB server 
mongoose.connect('mongodb://localhost:27017/urls', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; 

db.on('error', err => console.error(err));
db.once('open', () => console.log('Database is connected!'));

app.use('/api', routes); 
app.use(cors());

// Parse POST bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/static', express.static('public'));

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
    console.log('Error occurred', err); 
    res.status(err.status || 500);
    res.json({ error: err.message }); 
});

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});