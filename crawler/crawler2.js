// promise 版本
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
// 刷牙 -> 吃早餐

// 1. 做出 Promise 基本的版型
new Promise((resolve, reject) => {
  // 2. 把非同步工作搬進來
  fs.readFile("stock.txt", "utf8", (err, stockCode) => {
    if (err) {
      // console.error(err);
      // 4. 找到失敗的地方，用 reject 把錯誤傳出去
      reject(err);
    } else {
      // 有成功讀檔
      // 3. 找到原本處理成功的地方，利用 resolve 把結果傳出去
      resolve(stockCode);
    }
  });
})
  // 5. 用 then 的第一個參數來接住 resolve
  .then((stockCode) => {
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        response: "json",
        date: moment().format("YYYYMMDD"),
        stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
      },
    });
  })
  .then((response) => {
    console.log(response.data.title);
  })
  .catch((err) => {
    // 6. 用 catch 來統一處理 reject
  });
