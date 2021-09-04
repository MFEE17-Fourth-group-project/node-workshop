const express = require("express");
const connection = require("./utils/db");
const path = require("path");
require("dotenv").config();
// 利用 express 建立了一個 express application
let app = express();

// 處理 cors 問題
// 後端必須要開放、允許跨源請求
// 這樣跨源的前端才不會被瀏覽器擋下來
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000"],
    // 跨源送 cookie
    // 如果要把 credentials 設成 true, 那 origin 就不能是 *
    // 不然太恐怖，誰都可以跨源送 cookie
    credentials: true,
  })
);

// 啟用 session 機制
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
  })
);

// 使用這個中間件才可以讀到 body 的資料
app.use(express.urlencoded({ extended: true }));
// 使用這個中間件，才可以解析到 json 的資料
app.use(express.json());

// 用中間件來設定靜態檔案(static)的位置
// 靜態檔案: 圖片、前端的js, css, html,....
// http://localhost:3002
app.use(express.static(path.join(__dirname, "public")));
// 因為 react 檔案夾裡，我們有放了 index.html
// 這個中間件的設定又是在 / 路由前，所以首頁被這裡給攔截了
// 把 index.html 讀出來，而且 response 回去了
// --> 同源
app.use(express.static(path.join(__dirname, "react")));
// static 使靜態資源: html, css, js, images,..
// 透過 static 來部署 react 的話，他只幫忙到回覆 index.html

// app.use 使用一個「中間件」
// app.use(middleware))
app.use((req, res, next) => {
  // B
  let current = new Date();
  console.log(`有人來訪問嚕 at ${current.toISOString()}`);
  // 一定要呼叫，不然不會前往下一個
  // 他不會知道下一個是誰，下一個是誰是工程師用順序決定
  // 低耦合，職責切割分明
  next();
});

// pipeline pattern
app.use((req, res, next) => {
  // A
  console.log("我是第二個中間件");
  next();
});

// HTTP Method: get, post, put, patch, delete
// router 路由: 特殊的 middleware
app.get("/", function (request, response, next) {
  response.send("Hello with nodemon");
});

app.get("/doc", (req, res, next) => {
  res.send("I am DOC");
});

// app.METHOD
app.get("/test", (req, res, next) => {
  // 因為已經 response，所以就終點了
  // res.send("About us A");
  // 如果不呼叫 response，那就還沒終點
  // 記得要呼叫 next 讓他前往下一個符合的 route
  console.log("我是 ABOUT !!!!!!!");
  // next(); // 正確去下一個路由
  // 如果 next 中間有任何參數(不可以是"route")，就等於是通知 express 這裡有錯誤了
  let isLogin = false;
  if (isLogin) {
    next();
  } else {
    next({
      code: "330001",
      status: 401,
      message: "沒有登入不能用喔",
    });

    next("錯了喔");
  }
});

app.get("/test", (req, res, next) => {
  // 這裡有終點
  res.send("About us B");
});

let stockRouter = require("./routers/stock");
// /stock
// /stock/:stockCode
app.use("/api/stock", stockRouter);

// 引入 auth router 中間件
let authRouter = require("./routers/auth");
// 使用這個路由中間件
app.use("/api/auth", authRouter);

// 引入 member router 中間件
let memberRouter = require("./routers/member");
// 使用這個路由中間件
app.use("/api/member", memberRouter);

// 放在所有 API 下方，如果不是 /api/xxx 的就會進入這裡
// 讓前端可以處理 route
// 加上這個後，負責處理 404 的中間件就沒有用了
// 不管網址是 /about, /stock/2330,...不管是什麼
// 只要前面沒有，我們就當作他不是 API
// 那我們就回 react 的起點 index.html
app.get("/*", (req, res, next) => {
  console.log("準備回覆 react index.html");
  res.sendFile(path.join(__dirname, "react", "index.html"));
});

// divide and conquer
// 分而治之
app.use((req, res, next) => {
  console.log("啊啊啊啊，都沒有符合的路由");
  next();
});

// 既然會掉這裡來，表示前面都沒有任何符合的路由網址
// 導致沒有任何 response (旅程一直沒有被結束)
// 利用這個特定，把這裡當成 404 來處理
app.use((req, res, next) => {
  res.status(404).json({ message: "NOT FOUND" });
});

// 超級特殊的 middleware
// 他有四個參數，這個是用來捕捉錯誤 Exception 用的
// 必須把這個錯誤處理中介函式放在最下面
// 有點像 catch
// (1) 沒有處理的 exception
// (2) 流程上設計，想要跳到這裡 -> next(xxx) 透過在 next 傳遞"參數"
const multer = require("multer");
app.use((err, req, res, next) => {
  // multer 丟出來的 exception 不符合我們制定的格式
  console.error("來自四個參數的錯誤處理", err);
  // 判斷這個 err 是誰？
  if (err instanceof multer.MulterError) {
    // 到這裡表示我們知道這一次來的 err 其實是 MulterError
    // 而且我們有觀察到 MulterError 有一個 code 可以辨別錯誤
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ code: 320001, message: "檔案太大啦" });
    }
    return res.status(400).json({ message: err.message });
  }
  // 如果不符合上述特殊的錯誤類別，那表示就是我們自訂的
  // 我們自己拋出的錯誤有自己制定的格式
  // {
  //   code: "330001",
  //   status: 401,
  //   message: "沒有登入不能用喔",
  // }
  res.status(err.status).json({ message: err.message });
});

const port = 3002;
app.listen(port, async function () {
  // 因為改成用 pool，所以不需要手動連線
  // await connection.connectAsync();
  console.log(`我們的 web server: ${port} 啟動了～`);
});

// /stock
// /stock/:stockCode

// /auth/register
// /auth/login
