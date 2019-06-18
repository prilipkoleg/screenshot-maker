var ObjectID = require('bson-objectid');

module.exports = {
  "localhost:27017": {
    "databases": {
      "screenshot-maker-test": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "users"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "screenshot-maker-test.users",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "users",
            "documents": [
              {
                "_id": "dd0b798f-dab1-4c00-b266-3e3f19ac1707",
                "username": "first",
                "email": "test@gmail.com",
                "salt": "0.9680459533226191",
                "hashedPassword": "8c6e8881b71deec0ad6e2e39ac498c622a004ba9",
                "created": "2019-05-05T14:06:40.969Z",
                "__v": 0
              }
            ]
          }
        ]
      }
    }
  }
}