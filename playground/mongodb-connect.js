//const MongoClient = require('mongodb').MongoClient;
 const {MongoClient, ObjectID} = require('mongodb'); 

// var obj = new ObjectID();
// console.log(obj);

// useNewUrlParser is new and must be added. in connection url /TodoApp is default db connection
// to create new db, just give the name. 

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },(err,db)=>{
    if(err){
        return console.log('Unable to Connect to MongoDB');
    }
    console.log('Connected to MongoDB server');

    // it will connect to TodoApp by default, and it will create Todos collection by just giving the name
//     db.db().collection('Todos').insertOne({
//         text:'Some to do',
//         completed:false
//     },(err,res)=>{
//         if(err){
//             return console.log('Unable to insert todo ',err);
//         }
//         console.log(JSON.stringify(res.ops,undefined,2));
//         console.log(res.ops);
//     });

// // it will create allll db, and then Todos collection is created by just giving the collection name.
//     db.db('allll').collection('Todos').insertOne({
//         text:'Some to do',
//         completed:false
//     },(err,res)=>{
//         if(err){
//             return console.log('Unable to insert todo ',err);
//         }
//         console.log(JSON.stringify(res.ops,undefined,2));
//     });

    // db.db().collection('Users').insertOne({        
    //     name:'MATT',
    //     age:25,
    //     location:'Phili'
    // },(err,res)=>{
    //     if(err){
    //         return console.log('Unable to insert todo ',err);
    //     }
    //     console.log(JSON.stringify(res.ops,undefined,2));
    //     console.log(res.ops[0]._id.getTimestamp());
    // });


    db.close();
});
