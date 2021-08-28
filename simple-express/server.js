const express = require("express");
const connection = require("./utils/db");

// 利用 express 建立了一個 express application
let app = express();

// 處理 cors 問題
const cors = require("cors");
app.use(cors());

// 使用這個中間件才可以讀到 body 的資料
app.use(express.urlencoded({ extended: true }));
// 使用這個中間件，才可以解析到 json 的資料
app.use(express.json());

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

// app.METHOD
app.get("/about", (req, res, next) => {
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

app.get("/about", (req, res, next) => {
  // 這裡有終點
  res.send("About us B");
});

let stockRouter = require("./routers/stock");
// /stock
// /stock/:stockCode
app.use("/stock", stockRouter);

// 引入 auth router 中間件
let authRouter = require("./routers/auth");
// 使用這個路由中間件
app.use("/auth", authRouter);

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
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status).json({ message: err.message });
});

app.listen(3002, async function () {
  // 因為改成用 pool，所以不需要手動連線
  // await connection.connectAsync();
  console.log("我們的 web server 啟動了～");
});

// /stock
// /stock/:stockCode

// /auth/register
// /auth/login
