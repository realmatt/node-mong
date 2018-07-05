require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    console.log(req.body);
    var todo = new Todo(req.body);
    todo.save().then((doc)=>{
        res.status(200).send(doc);
    },(e)=>{
        res.status(400).send(e);
        //console.log(e);
    });
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    })
});

app.get('/todos/:id',(req,res)=>{
    var id =req.params.id;    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }    
    Todo.findById({_id:id}).then((todos)=>{
        //console.log(todos);
        if(!todos){
            return res.status(404).send();
        }
        res.send({todos})
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.delete('/todos/:id',(req,res)=>{
 var id = req.params.id;
 if(!ObjectID.isValid(id)){
     return res.status(404).send();
 }
 Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
        return res.status(404).send();
    } 
    res.send({todo});
 }).catch((e)=>{
    res.status(400).send();
 })
});

app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findById(id).then((todo)=>{
        if(todo.completed && body.completed){
            body = _.pick(body,['text']);
            console.log(body);
        }
    }).then(()=>{
    Todo.findByIdAndUpdate(id, {$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
});
});

app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new Users(body);
    user.save().then((user)=>{
        //res.send(user);
        return user.generateAuthToken();
    })
    .then((token)=>{
        res.header('x-auth',token).send(user)
    })    
    .catch((e)=>{
        res.status(400).send(e);
    });

});

app.get('/users/me',authenticate,(req,res)=>{
    // var token = req.header('x-auth');
    // Users.findByToken(token).then((user)=>{
    //   if(!user){
    //     //    res.status(401).send();
    //     // it will fire catch
    //     return Promise.reject();
    //   }  
    //   res.send(user);
    // }).catch((e)=>{
    //     res.status(401).send();
    // });
    res.send(req.user);
});

app.listen(port, ()=>{
   console.log('Server is listening on Port ',port); 
});

module.exports = {app};