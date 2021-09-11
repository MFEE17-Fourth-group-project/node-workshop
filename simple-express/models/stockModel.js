const connection = require("../utils/db");

// 取得所有股票列表
async function getAll() {
  return await connection.queryAsync("SELECT * FROM stock");
}

// 計算某個股票代碼的總筆數
async function countByCode(stockCode) {
  let count = await connection.queryAsync(
    "SELECT COUNT(*) AS total FROM stock_price WHERE stock_id=?",
    [stockCode]
  );
  // [ RowDataPacket { total: 41 } ]
  console.log(count);
  return count[0].total;
}

// 取得某個股票代碼的分頁資料
async function getPriceByCodePage(stockCode, perPage, offset) {
  return await connection.queryAsync(
    "SELECT * FROM stock_price WHERE stock_id=? ORDER BY date LIMIT ? OFFSET ?",
    [stockCode, perPage, offset]
  );
}

module.exports = {
  getAll,
  countByCode,
  getPriceByCodePage,
};
