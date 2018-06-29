//const MongoClient = require('mongodb').MongoClient;
 const {MongoClient, ObjectID} = require('mongodb'); 


MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },(err,db)=>{
    if(err){
        return console.log('Unable to Connect to MongoDB');
    }
    console.log('Connected to MongoDB server');  
    
    //deleteMany
    // db.db().collection('Todos').deleteMany({text:'Some to do'}).then((res)=>{
    //     console.log(res);
    // });

    //deleteOne

    // db.db().collection('Todos').deleteOne({text:'Some to do1'}).then((res)=>{
    //     console.log(res);
    // });

    //findOneAndDelete
    
    // db.db().collection('Todos').findOneAndDelete({completed:true}).then((res)=>{
    //     console.log(res);
    // });

    
    // db.db().collection('Users').deleteMany({name:'MATT'}).then((res)=>{
    //     console.log(res);
    // });

    db.db().collection('Users').findOneAndDelete({_id:123}).then((res)=>{
        console.log(res);
    });

    db.close();
});
