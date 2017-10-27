const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//var id = '59f2edccc26b99970f013680';

//if (!ObjectID.isValid(id)) {
//  console.log('ID not valid');
//};
//
//Todo.find({
//  _id: id
//}).then((todos) => {
//  console.log('Todos', todos);
//});
//
//Todo.findOne({
//  _id: id
//}).then((todo) => {
//  console.log('Todo', todo);
//});
//
//Todo.findById(id).then((todo) => {
//  if (!todo) {
//    return console.log('Id not found');
//  }
//  console.log('Todo By Id', todo);
//}).catch((e) => console.log(e));

User.findById('59f23ffe2a6c6eb30a863acc').then((user) => {
  if (!user) {
    return console.log('Unable to find user');
  }
  
  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log(e);
}).catch((e) => console.log(e));