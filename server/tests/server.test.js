const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
    {   _id:new ObjectId(),
        text:'Todo1'
    }, 
    {
        _id:new ObjectId(),
        text:'Todo2',
        compeleted:true,
        compeletedAt:new Date().getTime()
    }];

var id = '';

/* Remove all the elements in collection */
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);       
    }).then((res)=>{
        //console.log(res); 
        done();
    })
});



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
  