const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const taskInstanceSchema = new Schema({
    task_id : {
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
    },
    user_id: {
        type: String 
    },  
    status: {
        type: String 
    }

},
{
    timestamps: true
}); 
 

module.exports = mongoose.model('TaskInstance', taskInstanceSchema); 