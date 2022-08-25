//require mongoose to run queries
const mongoose = require('mongoose');
//declare schema with name todoSchema
const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true 
    },
    email:{
        type : String,
        required: true,
        unique: true
    },
    dob:{
        type : Date,
        required: true,
    },
    username:{
        type : String,
        required : true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phno:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    }


    
});
//convert todoSchema schema to model named Todo
const User = mongoose.model('User', userSchema);
//export Todo model
module.exports = User;