// GET
// https://www.twse.com.tw/exchangeReport/STOCK_DAY
// ?
// response=json
// &
// date=20210807
// &
// stockNo=2330

const axios = require("axios");
const moment = require("moment");
// 讀檔案，把股票代碼讀進來
// nodejs 內建的功能 -> 不需要 npm i
const fs = require("fs");

// 刷牙 -> 吃早餐

fs.readFile("stock.txt", "utf8", (err, stockCode) => {
  axios
    .get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        response: "json",
        date: moment().format("YYYYMMDD"),
        stockNo: stockCode, // 長榮航空 2618  長榮航海王 2603
      },
    })
    .then((response) => {
      console.log(response.data.title);
    });
});
