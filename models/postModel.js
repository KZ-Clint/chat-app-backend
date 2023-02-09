const mongoose = require('mongoose')

const postSchema = mongoose.Schema( {
    userId: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    img: {
        type: String
    },
    description: {
        type: String,
        max:500
    }
}, { timestamps: true } )


module.exports = mongoose.model('chatpost', postSchema )