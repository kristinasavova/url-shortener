const express = require('express');
const router = express.Router();
const { URL } = require('./models'); // import URL model 
 
/**
 * POST '/api/shorturl/new' and redirect to '/shorturl/new/:index'
 */
router.post('/shorturl/new', (req, res, next) => { 
    const urlString = req.body.url; 
    let index;  // index for a short version of the URL 
    URL.findLastURL((err, urls) => {  // retrive the last saved URL from the database
        if (err) return next(err);
        if (urls.length) {   // if there is a saved URL in the database 
            index = urls[0].index + 1; // assign a value to the index that is one more than the index of the previously saved URL
        } else {
            index = 1; // if there are no saved URL in the database collection, index is equal to one
        } 
        URL.create({ urlString, index }, (err, url) => {  // create a new URL using data from the POST request body
            if (err) next(err);  
            if (url) {
                res.json({  // send json response if the URL is successfully created
                    original_url: url.urlString,
                    short_url: url.index
                });
            } else { 
                return; // return if the URL is not created 
            }
        });
    });
});

/**
 * GET '/shorturl/:index' and redirect to the corresponding original URL
 */
router.get('/shorturl/:index', (req, res, next) => {
    URL.findOne({ index: req.params.index }, (err, url) => {  // find URL using index from the request params 
        if (err) return next(err); 
        if (url) {  // if there is a URL with this index, redirect to the original URL
            res.status(303).redirect(url.urlString);
        } else {  // if there is no URL with this index, send 404 error 
            const error = new Error('Not Found');
            error.status = 404;
            next(error);
        }
    });
});
    
module.exports = router; 