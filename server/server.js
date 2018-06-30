const express = require('express');
const bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/user');

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

app.listen(port, ()=>{
   console.log('Server is listening on Port ',port); 
});

module.exports = {app};