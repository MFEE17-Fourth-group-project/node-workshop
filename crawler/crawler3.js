// promise 版本
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
// 刷牙 -> 吃早餐

// await
// 1. 幫我們暫停
// 2. 幫我們取得 resolve 的結果
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

  let response = await axios.get(
    "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
    {
      params: {
        response: "json",
        date: moment().format("YYYYMMDD"),
        stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
      },
    }
  );

  console.log(response.data.title);
}

try {
  doWork();
} catch (e) {
  console.error(e);
  console.warn();
  console.info();
  console.trace();
  console.debug();
}
