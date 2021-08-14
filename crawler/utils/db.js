const mysql = require("mysql");
require("dotenv").config();
const Promise = require("bluebird");

// exports = module.exports = {};

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// bluebird
// 擴充
// connect -> connectAsync
// query -> queryAsync
connection = Promise.promisifyAll(connection);

module.exports = connection;

// const connection = require();
// connection.query

// module.exports.connection = connection;
// const db = require();
// db.connection.query
// const {connection} = require()
// connection.query
