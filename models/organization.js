const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    role: {
        type: String
    },
    email: {
        type: String 
    },
    username: {
        type: String
    } 
}); 

const orgSchema = new Schema({
    name: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: false 
    },
    tasks: [Schema.Types.Mixed], 
    users: [Schema.Types.Mixed], 
    admin: userSchema 
},
{
    timestamps: true
});

module.exports = mongoose.model('Organization', orgSchema); 