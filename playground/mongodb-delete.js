//var MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // Create MongoClient variable which equals with require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  };
  
  console.log('Connected to MongoDB server');
  
  // deleteMany 
//  db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
//    console.log(result);
//  });
  
  // deleteOne
//  db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
//    console.log(result);
//  });
  
  // findOneAndDelete
  db.collection('Todos').findOneAndUpdate({duration: 10}, {$inc: {duration: +2}}, {returnOriginal: false}).then((result) => {
    console.log(result);
  });
  
  // db.close();
});