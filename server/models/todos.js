const mongoose = require('mongoose');
const todoSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    important: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Todo', todoSchema)