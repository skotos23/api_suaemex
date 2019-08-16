const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema_documents = new Schema({
    title:{type:String, require: true},
    file:{type: String},
    date: {type:Date, default: Date.now},
    user: {type: String}
});
module.exports = mongoose.model('document', schema_documents);
//1:19:36