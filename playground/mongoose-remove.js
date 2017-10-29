const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}) - usuwa wszystkie rekordy
//Todo.remove({}).then((result) => {
//  console.log(result);
//});

//Todo.findOneAndRemove();
//Todo.findByIdAndRemove();

Todo.findByIdAndRemove('59f5a392d3a7478b724899ae').then((todo) => {
  console.log(todo);
});