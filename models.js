const mongoose = require('mongoose'); 
const dns = require('dns');
const url = require('url');

const URLSchema = new mongoose.Schema({
    urlString: {
        type: String,
        trim: true,
        unique: true, 
        required: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    },
    index: {
        type: Number,
        unique: true,
        required: true
    }
});

/**
 * Check if the submitted URL is a valid URL
 */
URLSchema.pre('save', function(next) {
    // 'this' refers to the document to be saved 
    const { hostname } = url.parse(this.urlString);
    if (hostname) {
        dns.lookup(hostname, err => {
            if (err) return next(err); 
            return next(); 
        });
    } else {
        const err = new Error('invalid URL');
        err.status = 400;
        return next(err); 
    }
});

/**
 * Find the last created URL in the collection   
 */
URLSchema.statics.findLastURL = function(callback) {
    // 'this' refers to the model - URL 
    return this.find({}, {}, { sort: { 'createdAt': -1 }, limit: 1 }, callback);
};

const URL = mongoose.model('URL', URLSchema);  

module.exports.URL = URL; 