import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/config";
import { useAuth } from "../context/auth";
// 1. react 做了一個 config.js --> .env failed???
// 2. 在用到設定的地方都 import config.js 的變數
// 3. 後端分頁: 取得總筆數、計算總頁數、取得該頁資料、回覆 pagination 給前端
// 4. 前端: 先取得正確格式 res.data --> res.data.result 先驗證原本的東西沒有壞
// 5. 開始做前端頁碼: 渲染頁碼、setTotalPage、修改 useEffect 跟呼叫的 API 網址

const StockDetails = () => {
  // 字串
  const { stockId, currentPage } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { token, setToken } = useAuth();

  // 分頁屬性
  // 紀錄我現在在第幾頁
  // 如果 currentPage 沒有設定，那就預設第一頁
  const [page, setPage] = useState(parseInt(currentPage, 10) || 1);
  // 偵測網址上的變化
  useEffect(() => {
    setPage(parseInt(currentPage, 10) || 1);
  }, [currentPage]);

  // 總共有幾頁
  const [totalPage, setTotalPage] = useState(0);
  const getPages = () => {
    let pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push(
        <li
          style={{
            display: "inline-block",
            margin: "2px",
            backgroundColor: page === i ? "#00d1b2" : "",
            borderColor: page === i ? "#00d1b2" : "#dbdbdb",
            color: page === i ? "#fff" : "#363636",
            borderWidth: "1px",
            width: "28px",
            height: "28px",
            borderRadius: "3px",
            textAlign: "center",
          }}
          key={i}
          onClick={(e) => {
            console.log("push", `/stock/${stockId}/${i}`);
            history.push(`/stock/${stockId}/${i}`, { page: i });
            setPage(i);
          }}
        >
          {i}
        </li>
      );
    }
    return pages;
  };

  // 瀏覽器上下頁的時候要更新資料
  let history = useHistory();

  useEffect(() => {
    const getStockData = async () => {
      try {
        let res = await axios.get(`${API_URL}/stock/${stockId}?page=${page}`);
        setTotalPage(res.data.pagination.lastPage);
        setData(res.data.result);
        setError(null);
        // history.push(`/stock/${stockId}/${page}`, { page});
      } catch (e) {
        console.log(e);
        setError(e.message);
      }
    };
    getStockData();
  }, [page]);
  // [] --> 只有第一次 render 的時候才觸發
  // [page] --> page 變的時候 -> render -> 這個 effect 會被呼叫

  return (
    <div>
      {error && <div>{error}</div>}
      <ul>{getPages()}</ul>
      {data &&
        data.map((day) => (
          <div
            className="bg-white bg-gray-50 p-6 rounded-lg shadow m-6"
            key={day.date}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              日期： {day.date.slice(0, 10)}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交金額： {day.amount}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交股數： {day.volume}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              開盤價： {day.open_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              收盤價： {day.close_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              漲跌價差： {day.delta_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最高價： {day.high_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              最低價： {day.low_price}
            </h2>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              成交筆數： {day.transactions}
            </h2>
          </div>
        ))}
    </div>
  );
};

export default StockDetails;
