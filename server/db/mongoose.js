var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp').catch((err)=>{
    console.log('Unable to Connect Server');
 
});

module.exports = {
    mongoose
};