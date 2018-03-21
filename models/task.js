const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const taskSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    task_type: {
        type: String,
        required: true  
    }, 
    task: {
        type:  Schema.Types.Mixed,
        required: true 
    },
    task_identifier: { //global or school
        type: String,
        required: true  
    },
    task_ord_id: {
        type: String 
    }

},
{
    timestamps: true
}); 
 

module.exports = mongoose.model('Task', taskSchema); 