//var MongoClient = require('mongodb').MongoClient;
var {MongoClient, ObjectID} = require('mongodb'); // Create MongoClient variable which equals with require('mongodb').MongoClient

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  };
  
  console.log('Connected to MongoDB server');
  
  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: true
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    };
    
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
//  
//  db.collection('Users').insertOne({
//    name: 'Sławek',
//    age: 27,
//    location: 'Krasnystaw'
//  }, (err, result) => {
//    if (err) {
//      return console.log('Unable to insert todo', err);
//    }
//    
//    console.log(result.ops[0]._id.getTimestamp());
//  });
  db.close();
});