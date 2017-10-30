const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        };
    
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
  
  it('should not create todo with invalid body data', (done) => {
    // obsługa wysłania pustego requesta, >status 400, todos.length === 0
    
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        };
      
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET /todos', () => {
  
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
    })
      .end(done);
  })
  
});


describe('GET /todos/:id', () => {
  
  it('should return 404 status when invalid Id', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
  
  
  it('should return 404 status when not founded Id', (done) => {
    var hexId = new ObjectID().toHexString();
    
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  
  
  it('should return doc in response body', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
    })
      .end(done);
  });
  
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      
      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });
  
  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  
  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});


describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first item
    var {_id, text} = todos[0];
    var hexId = _id.toHexString();
    
    var updatedText = text + '123';
    
    // update text, set completed true
      request(app)
        .patch(`/todos/${hexId}`)
        .send({"text": updatedText, "completed": true})
        .expect(200)
        .expect((res, req) => {
          expect(res.body.todo.text).toEqual(updatedText);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAt).toBeA('number');
      })
        .end(done);
  });
  
  
  it('should clear completedAt when todo is not completed', (done) => {
    // grab id of second id todo item
    var {_id, text} = todos[1];
    var hexId = _id.toHexString();
    
    var updatedText = text + '123';
    var completed = false;
    
    // update the text , set completed false
    // 200
    // text is changed, completed false, completedAt is null .toNotExist  
    request(app)
        .patch(`/todos/${hexId}`)
        .send({"text": updatedText, "completed": false})
        .expect(200)
        .expect((res, req) => {
          expect(res.body.todo.text).toEqual(updatedText);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
      })
        .end(done);
  });
});


describe('GET /todos/users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
    })
      .end(done);
  });
  
  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
    })
      .end(done);
  });
});


describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';
    
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toExist();
    })
      .end((err) => {
      if (err) {
        return done(err);
      }
      
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      })
    });
  });
  
  
  it('should return validation errors if request invalid', (done) => {  
    request(app)
      .post('/users')
      .send({
        email: 'example@example.com',
        password: '1'
      })
      .expect(400)
      .end(done);
  });
  
  
  it('should not create user if email in use', (done) => {
    var email = 'jen@example.com';
    var password = '123mnb!';
    
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});