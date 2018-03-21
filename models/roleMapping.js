const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
 
const roleMappingSchema = new Schema({
    user_id: {
        type: String,
        required: true 
    },
    school_id: {
        type: String,
        required: false 
    },
    role: {
        type: String,
        required: false 
    },
    status: {
        type: String,
        required: false 
    } 
},
{
    timestamps: true
});

module.exports = mongoose.model('RoleMapping', roleMappingSchema); 