// const { MongoClient } = require("mongodb");
// const mongoose = require('mongoose')

// let dbConnection;

// module.exports = {
//   connectToDb: (cb) => {
//     MongoClient.connect("mongodb://localhost:27017/bookstore").then(
//       (client) => {
//         dbConnection = client.db();
//       }
//     ).catch((error)=>{
//         console.log(error)
//         cb(error)
//     })
//     cb();
//   },
//   getdb: () => dbConnection,
// };

//  const { MongoClient } = require("mongodb");

//  let connectionDb;

//  module.exports = {
//    connectToDb: (cb) => {
//      MongoClient.connect("mongodb://localhost:27017/bookstore")
//        .then((client) => {
//          connectionDb = client.db();
//          cb();
//        })
//        .catch((error) => {
//          console.log(error);
//          cb(error);
//        });
//    },
//    getDb: () => connectionDb,
//  };

const { MongoClient } = require("mongodb");

let dbConnection;
const url = "mongodb://localhost:27017/netflix";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(url)
      .then((client) => {
        dbConnection = client.db();
        cb();
      })
      .catch((error) => {
        console.log(error);
        cb(error);
      });
  },
  getDb: () => dbConnection,
};
