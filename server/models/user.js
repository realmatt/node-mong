const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// schema is used to describe methods in model. Therefore first schmea object created, then import to models

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            // validator:(value)=>{
            //     return validator.isEmail(value);
            // },
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

// schema methods. methods for instance object.
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    // now we send only _id and email
    return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();

    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
};

UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
}

// statics is for Class like prototype
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    } catch(e){
        // return new Promise((resolve,reject)=>{
        //     reject();
        // });
        // same thing        
        return Promise.reject();
    };
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });

};

// mongoose middleware. Pre before the event occur
// we use function keyword because of using this. In arrow function can not use this.
UserSchema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// this is for login
UserSchema.statics.findByCredentials = function (email,password) {
    var User = this;
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });
};

var Users = mongoose.model('User',UserSchema);

module.exports = {Users};