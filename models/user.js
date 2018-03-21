const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let isEmailLengthCorrect = (email) =>{
    if(!email){
        return false;
    }else{
        if(email.length < 4 || email.length > 40){
            return false;
        }else{
            return true;
        }
    }
}

let isThisValidEmail = (email) =>{
    if(!email){
        return false;
    }else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

let isUsernameInDesiredLength = (username) =>{
    if(!username){
        return false;
    }else{
        if(username.length < 3 || username.length > 30){
            return false;
        }else{
            return true;
        }
    }
}

let isUsernameValid = (username) =>{
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

let isPasswordInDesiredLength = (password) =>{
    if(!password){
        return false;
    }else{
        if(password.length < 8 || password.length > 40){
            return false;
        }else{
            return true;
        }
    }
}
 
const emailValidatiors = [
    {
        validator : isEmailLengthCorrect, 
        message : "Email length should be contains atleast 4 character or maximum 40 characters"
    },
    {
        validator : isThisValidEmail, 
        message : "Email is not valid...!"
    }
];

const usernameValidatiors = [
    {
        validator : isUsernameInDesiredLength, 
        message : "username should be contains atleast 2 character or maximum 30 characters"
    },
    {
        validator : isUsernameValid, 
        message : "Username is not in valid format...!"
    }
]

const passwordValidatiors = [
    {
        validator : isPasswordInDesiredLength, 
        message : "password should be contains atleast 8 character or maximum 40 characters"
    } 
]


const userSchema = new Schema({
    role: {
        type: String,
        required: false, 
        lowercase: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: emailValidatiors
    },
    username: {
        type: String,
        required: true, 
        lowercase: true,
        validate: usernameValidatiors
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidatiors
    }
});

userSchema.pre('save', function (next) {
    if(!this.isModified('password'))
        return next();
    
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password =  hash;
        next();
    });
     
});
/*
userSchema.pre('update', function(next) {

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password =  hash;
        next();
    });
    
    this.update({}, { password:   this.password } ); 
    next();
  });

  userSchema.pre('update', function(next) {
    console.log("userSchema.pre('update'")
    console.log(this.password)
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password =  hash;
        console.log("userSchema.pre('update'")
        console.log(this.password)
        this.update({},{ $set: { password: this.password } });
        next();
    }); 
  });*/

userSchema.methods.comparePasswords = function (password){
    return bcrypt.compareSync(password,this.password)
}

module.exports = mongoose.model('User', userSchema); 