// 這裡是 stock router 的模組
const express = require("express");
const router = express.Router();
// router 就是一個在 app 底下的小 app
// 也是中間件(middleware)
const connection = require("../utils/db");

// stock GET API
// /stock
router.get("/", async (req, res, next) => {
  let result = await connection.queryAsync("SELECT * FROM stock");
  res.json(result);
});

// A(前端分頁): 後端資料全給，由前端來分頁
// B(後端分頁): 前端告訴後端我在第幾頁，後端給出該頁的資料
// /stock/2330 ==> stockCode = 2330
// /stock/2330?page=1
router.get("/:stockCode", async (req, res, next) => {
  // req.params.stockCode
  // req.query.page
  let page = req.query.page || 1; // 目前在第幾頁，預設是第一頁
  const perPage = 10; //每一頁的資料是 10 筆
  // 總共有幾筆 / 總共有幾頁
  let count = await connection.queryAsync(
    "SELECT COUNT(*) AS total FROM stock_price WHERE stock_id=?",
    [req.params.stockCode]
  );
  // [ RowDataPacket { total: 41 } ]
  console.log(count);
  const total = count[0].total;
  const lastPage = Math.ceil(total / perPage); // 無條件進位
  console.log(total, lastPage);

  // 取得這一頁應該要有的資料
  // LIMIT: 要取幾筆資料（這一頁要幾筆資料）
  // OFFSET: 要跳過多少
  // page 1: 1-10  跳過 0 筆
  // page 2: 11-20 跳過前 10 筆
  let offset = (page - 1) * perPage;
  let result = await connection.queryAsync(
    "SELECT * FROM stock_price WHERE stock_id=? ORDER BY date LIMIT ? OFFSET ?",
    [req.params.stockCode, perPage, offset]
  );
  let pagination = {
    total, // 總共有幾筆
    perPage, // 一頁有幾筆
    lastPage, // 總共有幾頁（最後一頁）
    page, // 目前在第幾頁
  };
  res.json({ pagination, result });
});

module.exports = router;
