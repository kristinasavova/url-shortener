const express = require('express');
const router = express.Router();
const { URL } = require('./models'); // import URL model 
 
/**
 * POST '/api/shorturl/new' and send a shortened URL
 */
router.post('/shorturl/new', (req, res, next) => { 
    const urlString = req.body.url; 
    let index;
    URL.findLastURL((err, urls) => {
        if (err) return next(err);
        urls.length ? index = urls[0].index + 1 : index = 1;
        URL.create({ urlString, index }, (err, url) => {
            if (err) next(err);  
            res.status(303).redirect(`/api/shorturl/new/${url.index}`);
        });
    });
});

router.get('/shorturl/new/:index', (req, res, next) => {
    const { index } = req.params; 
    URL.findOne({ index }, (err, url) => {
        if (err) next(err); 
        if (url) {
            res.json({
                original_url: url.urlString,
                short_url: url.index
            });
        } else {
            const err = new Error('Not Found');
            err.status = 404;
            return next(err); 
        }
    });
});
    
module.exports = router; 