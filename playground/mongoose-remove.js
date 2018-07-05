const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})  --- 
// only return number of deleted items
// Todo.remove({}).then((res)=>{
//     console.log(res);
// });
// return deleted item
//Todo.findOneAndRemove
//Todo.findByIdRemove
Todo.findOneAndRemove({_id:'5b38a2f4b3f2dd224095d997'}).then((todo)=>{
    console.log(todo);
});
// Todo.findByIdAndRemove('5b38a2eab3f2dd224095d996').then((todo)=>{
//     console.log(todo);
// });