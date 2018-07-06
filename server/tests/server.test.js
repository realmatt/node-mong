const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {Users} = require('./../models/user');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

// it is removed to seed
// const todos = [
//     {   _id:new ObjectId(),
//         text:'Todo1'
//     }, 
//     {
//         _id:new ObjectId(),
//         text:'Todo2',
//         compeleted:true,
//         compeletedAt:new Date().getTime()
//     }];

//var id = '';

/* Remove all the elements in collection */
beforeEach(populateUsers);
beforeEach(populateTodos);



describe('POST /todos',()=>{

    it('should create a new todo',(done)=>{
        var text = 'From test tast';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            //check also db if it exist there
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=> done(e));
        });
    });

    it('should not create todo with invalid body data',(done)=>{
        request(app)
        .post('/todos')
        .send({text:''})
        .expect(400)
        // .expect((res)=>{
        //     //console.log(res);
        //     expect(res.body.errors.text.name).toBe('ValidatorError');
        // })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            // check db if none exist in db
            Todo.find({}).then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        })
    });

});

describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            //console.log(res.body);
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('^GET Ind. /todos',()=>{
    it('should return the todo by id',(done)=>{
        //console.log(id);
        //id icin todos[0].toHexString() can be used
        request(app)
        .get('/todos/'+todos[0]._id.toHexString())
        .expect(200)
        .expect((res)=>{
            //console.log(res.body);
            expect(res.body.todos.text).toExist(todos[0].text);
        })
        .end(done); 
    });

    it('should return 404 because of invalid id',(done)=>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });

    it('should return 404 because of not exist in db',(done)=>{
        var id1 = new ObjectId().toHexString();      
    request(app)
        .get('/todos/'+id1)
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
 
});

describe('Delete Ind. /todos',()=>{
    it('should remove the todo by id',(done)=>{
        //console.log(id);
        //id icin todos[0].toHexString() can be used
        request(app)
        .delete('/todos/'+todos[0]._id.toHexString())
        .expect(200)
        .expect((res)=>{
            //console.log(res.body);
            expect(res.body.todo.text).toExist(todos[0].text);
        })
        .end(done); 
    });

    it('should return 404 because of invalid id',(done)=>{
        request(app)
        .delete('/todos/123')
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });

    it('should return 404 because of not exist in db',(done)=>{
        var id1 = new ObjectId().toHexString();      
    request(app)
        .delete('/todos/'+id1)
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });
 
});


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'This should be the new text';
  
      request(app)
        .patch(`/todos/${hexId}`)
        .send({
          completed: true,
          text
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });
  
    it('should clear completedAt when todo is not completed', (done) => {
      var hexId = todos[1]._id.toHexString();
      var text = 'This should be the new text!!';
  
      request(app)
        .patch(`/todos/${hexId}`)
        .send({
          completed: false,
          text
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });
  });
  
  describe('GET /users/me',()=>{
        it('should return user if authenticated', (done)=>{
            request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                //console.log(res);
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
        });

        it('should return 401 if not authendticated',(done)=>{
            request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                console.log(res.body);
                expect(res.body).toEqual({});
            })
            .end(done);
        });
  });

  describe('POST /users',()=>{
    it('should sign up',(done)=>{
        var email='ex@ex.com';
        var password = '123mrb';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err)=>{
            if(err){
                return done(err);
            }
            Users.findOne({email}).then((user)=>{
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });
    it('should return validation errors if request invalid',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:'and',
            password:'123'
        })
        .expect(400)
        .end(done);
    });
    it('should not create user if email in use',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:users[0].email,
            password:'pass123'
        })
        .expect(400)
        .end(done);
    })
  });