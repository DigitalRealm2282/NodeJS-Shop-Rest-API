const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    size:{
        type:String,
        required:false
    },
    quantity:{
        type:Number,
        required:false
    }
})

module.exports = mongoose.model('product',productSchema);