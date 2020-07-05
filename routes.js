const express = require('express');
const router = express.Router();
const { URL } = require('./models'); // import URL model 
 
/**
 * POST '/api/shorturl/new' and send a shortened URL
 */
router.post('/shorturl/new', (req, res, next) => { 
    URL.create({ URLString: req.body.url }, err => {
        if (err) next(err); 
        // res.json({
        //     original_url: req.body.url,
        //     short_url: 'todo'
        // });
    }); 
});

module.exports = router; 