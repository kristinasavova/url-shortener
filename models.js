const mongoose = require('mongoose'); 
const { Schema } = mongoose; 

const URLSchema = new Schema({
    URLString: {
        type: String,
        trim: true,
        unique: true, 
        required: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const URL = mongoose.model('URL', URLSchema);  
module.exports.URL = URL; 