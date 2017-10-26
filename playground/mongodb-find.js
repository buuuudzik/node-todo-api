//var MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // Create MongoClient variable which equals with require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  };
  
  console.log('Connected to MongoDB server');
  
  db.collection('Users').find().toArray().then((docs) => {
    console.log(JSON.stringify(docs));
  }, (err) => {
    console.log(`Unable to fetch data: ${err}`);  
  });

  // db.close();
});