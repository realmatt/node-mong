//const MongoClient = require('mongodb').MongoClient;
 const {MongoClient, ObjectID} = require('mongodb'); 


MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },(err,db)=>{
    if(err){
        return console.log('Unable to Connect to MongoDB');
    }
    console.log('Connected to MongoDB server');

    db.db().collection('Todos').find({
        _id:new ObjectID('5b35ec1407241d1750629a59')
    }).toArray().then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2))
    },(err)=>{
        console.log('Unable to Fetch ',err);
    });

    db.db().collection('Todos').find().count().then((count)=>{
        console.log('Todos Count: ',count);
       // console.log(JSON.stringify(docs,undefined,2))
    },(err)=>{
        console.log('Unable to Fetch ',err);
    });

    db.db().collection('Users').find({name:'MATT'}).toArray().then((docs)=>{
        console.log('Users');
        console.log(JSON.stringify(docs,undefined,2))
    },(err)=>{
        console.log('Unable to Fetch ',err);
    });

    db.close();
});
