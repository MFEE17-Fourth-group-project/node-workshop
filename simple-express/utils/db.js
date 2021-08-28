const mysql = require("mysql");
require("dotenv").config();
const Promise = require("bluebird");

let connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // 設定預設值
  connectionLimit: process.env.CONNECTION_LIMIT || 10,
  dateStrings: true,
});

connection = Promise.promisifyAll(connection);
module.exports = connection;
