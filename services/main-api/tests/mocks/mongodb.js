const mongodb = require('mongo-mock');
const mockRequire = require('mock-require');

mongodb.max_delay = 0;//you can choose to NOT pretend to be async (default is 400ms)
const MongoClient = mongodb.MongoClient;
MongoClient.persist="./tests/mocks/mongoDB-TEST_DATA.js";//persist the data to disk

// Connection URL
const url = 'mongodb://localhost:27017/screenshot-maker-test';

const onConnect = new Promise((resolve, reject) => {
  // Use connect method to connect to the Server
  MongoClient.connect(url, {}, (err, db) => {
    err ? reject(err) : resolve(db);

    const userCollection = db.collection('users');

    userCollection.insert({
      "_id" : "dd0b798f-dab1-4c00-b266-3e3f19ac1707",
      "username" : "first",
      "email" : "test@gmail.com",
      "salt" : "0.9680459533226191",
      "hashedPassword" : "8c6e8881b71deec0ad6e2e39ac498c622a004ba9",
      "created" : "2019-05-05T14:06:40.969Z",
      "__v" : 0
    }, (err) => console.log('usersInserted', err));

  });
});


const exp = {
  client: MongoClient,
  onConnect,
};

mockRequire('../../common/mongodb.js', exp);

module.exports = exp;