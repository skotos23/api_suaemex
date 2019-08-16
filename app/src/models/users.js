const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let users_Schema = new Schema({
    name: {type:String, redirect: true},
    firstName: {type:String, redirect: true},
    lastName: {type:String, redirect: true},
    email: {type:String, redirect: true},
    password: {type:String, redirect: true},
    date: {type:Date, default: Date.now()},


});
users_Schema.methods.encryptPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);


};
users_Schema.methods.matchPassword= async function(password){
    return await bcrypt.compare(password, this.password);
};
module.exports= mongoose.model('user', users_Schema);