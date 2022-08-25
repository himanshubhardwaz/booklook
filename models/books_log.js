//require mongoose to run queries
const mongoose = require('mongoose');
var DateOnly= require('mongoose-dateonly')(mongoose);
//declare schema with name todoSchema
const bookSchema = new mongoose.Schema({
    bookname:{
        type : String,
        required : true 
    },
    bookauthor:{
        type: String,
        required: true
    },
    borrowprice:{
        type: Number,
        required: true
    },
    borrowduration:{
        type: Number,
        required: true
    },
    compensationprice:{
        type: Number,
        required: true
    },
    phno:{
        type: Number,
        required: true,
    },
    description:{
        type: String
    },
    renter: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
        required: true
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    },
    Validatedborrower: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    },
    borrowdate: {
        type: DateOnly,
    },
    returndate:{
        type: DateOnly,
    },
    total: {
        type: Number
    },
    returned:{
        type: Boolean,
        default: false
    },
    OTP:{
        type:Number,
        default:0
    }
});
//convert todoSchema schema to model named Todo
const Book = mongoose.model('Book', bookSchema);
//export Todo model
module.exports = Book;