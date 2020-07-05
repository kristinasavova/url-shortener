const mongoose = require('mongoose'); 
const dns = require('dns');
const url = require('url');

const URLSchema = new mongoose.Schema({
    URLString: {
        type: String,
        trim: true,
        unique: true, 
        required: true
    }, 
    shortURL: {
        type: Number,
        unique: true,
        default: 1 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

URLSchema.method('shorten', function(shortURL, callback) {
    // 'this' refers to the instance of the document itself
    const url = URL.find({ shortURL }, (err, url) => {
        if (url) {
            this.shortURL ++;
        }
    });
});

/**
 * Check if the submitted URL is a valid URL
 */
URLSchema.pre('save', function(next) {
    // 'this' refers to the document to be saved 
    const { hostname } = url.parse(this.URLString);
    if (hostname) {
        dns.lookup(hostname, (err, address, family) => {
            if (err) return next(err); 
            console.log(address, family);
            next(); 
        });
    } else {
        const err = new Error('invalid URL');
        err.status = 400;
        return next(err); 
    }
});

const URL = mongoose.model('URL', URLSchema);  

module.exports.URL = URL; 