
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');

const {Users} = require('./../../models/user');


const userOneId = new ObjectId();
const userTwoId = new ObjectId();

//remove from server.test.js refactoring purpose
const users = [
    {
        _id :userOneId ,
        email : 'matt@matt.com',
        password:'userOnePass',
        tokens:[{
            access:'auth',
            token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
        }] 
    },
    {
        _id :userTwoId ,
        email : 'jetto@jetto.com',
        password:'userTwoPass',
        tokens:[{
            access:'auth',
            token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
        }]          
    }
];
const todos = [
    {   _id:new ObjectId(),
        text:'Todo1',
        _creator:userOneId
    }, 
    {
        _id:new ObjectId(),
        text:'Todo2',
        compeleted:true,
        compeletedAt:new Date().getTime(),
        _creator:userTwoId
    }];

//remove from server.test.js. it will call from beforeEach
const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);       
    }).then((res)=>{
        //console.log(res); 
        done();
    })
};

const populateUsers = (done)=> {
    Users.remove({}).then(()=>{
        var userOne = new Users(users[0]).save();
        var userTwo = new Users(users[1]).save(); 
        return Promise.all([userOne,userTwo])
    }).then((res)=>{
        //console.log(res); 
        done();
    })
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}