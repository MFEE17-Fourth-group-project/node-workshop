const stockModel = require("../models/stockModel");

// 列出股票代碼
async function list(req, res, next) {
  let result = await stockModel.getAll();
  res.json(result);
}

// 根據股票代碼列出價格
async function getPriceByCode(req, res, next) {
  // req.params.stockCode
  // req.query.page
  let page = req.query.page || 1; // 目前在第幾頁，預設是第一頁
  const perPage = 10; //每一頁的資料是 10 筆
  // 總共有幾筆 / 總共有幾頁
  let total = await stockModel.countByCode(req.params.stockCode);
  const lastPage = Math.ceil(total / perPage); // 無條件進位
  console.log(total, lastPage);

  // 取得這一頁應該要有的資料
  // LIMIT: 要取幾筆資料（這一頁要幾筆資料）
  // OFFSET: 要跳過多少
  // page 1: 1-10  跳過 0 筆
  // page 2: 11-20 跳過前 10 筆
  let offset = (page - 1) * perPage;
  let result = await stockModel.getPriceByCodePage(
    req.params.stockCode,
    perPage,
    offset
  );
  let pagination = {
    total, // 總共有幾筆
    perPage, // 一頁有幾筆
    lastPage, // 總共有幾頁（最後一頁）
    page, // 目前在第幾頁
  };
  res.json({ pagination, result });
}

module.exports = {
  list,
  getPriceByCode,
};
