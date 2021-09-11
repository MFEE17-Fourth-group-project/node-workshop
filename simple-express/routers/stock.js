// 這裡是 stock router 的模組
const express = require("express");
const router = express.Router();
// router 就是一個在 app 底下的小 app
// 也是中間件(middleware)
const { loginCheckMiddleware } = require("../middlewares/auth");
const stockController = require("../controllers/stockController");

// stock GET API
// /stock
router.get("/", stockController.list);

// A(前端分頁): 後端資料全給，由前端來分頁
// B(後端分頁): 前端告訴後端我在第幾頁，後端給出該頁的資料
// /stock/2330 ==> stockCode = 2330
// /stock/2330?page=1
router.get("/:stockCode", loginCheckMiddleware, stockController.getPriceByCode);

module.exports = router;
