// promise 版本
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
// 第三方，需要 npmi
const mysql = require("mysql");
// 只需要 require
require("dotenv").config();

async function doWork() {
  let stockCode = await new Promise((resolve, reject) => {
    fs.readFile("stock.txt", "utf8", (err, stockCode) => {
      if (err) {
        reject(err);
      } else {
        // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
        // trim 移除前後的空白字元，包括換行
        resolve(stockCode.trim());
      }
    });
  });

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  connection.connect((err) => {
    if (err) {
      console.error("資料庫連不上");
    }
  });

  // 不關閉連線，認為程式一直在執行
  connection.end();

  // let response = await axios.get(
  //   "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
  //   {
  //     params: {
  //       response: "json",
  //       date: moment().format("YYYYMMDD"),
  //       stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
  //     },
  //   }
  // );

  // console.log(response.data.title);
}

try {
  doWork();
} catch (e) {
  console.error(e);
}
