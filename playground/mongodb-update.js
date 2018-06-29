//const MongoClient = require('mongodb').MongoClient;
 const {MongoClient, ObjectID} = require('mongodb'); 


MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },(err,db)=>{
    if(err){
        return console.log('Unable to Connect to MongoDB');
    }
    console.log('Connected to MongoDB server');  

    db.db().collection('Todos').findOneAndUpdate({
        text:'Hello'
    },{$set: {
        completed:false
    }
    },{returnOriginal:false}).then((res)=>{
        console.log(res);
    });

    db.db().collection('Users').findOneAndUpdate({
        name:'MATTO'
    },{$inc: {
        age:1
    }
    },{returnOriginal:false}).then((res)=>{
        console.log(res);
    });


    db.close();
});
