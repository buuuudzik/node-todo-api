var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;  
  
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return console.log('Not valid Id');
  }
  
  Todo.findById(id).then((todo) => {
    if (!todo) {
      res.status(404).send();
      return console.log('There is no todo with this Id');
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
    console.log(e);
  });
  // validate id using isValid
  // if not status 404
  // findById
  // success
  // if todo - send it back
  // if not then 
  // error 400 - and send empty body
});

app.listen(3000, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};