const express = require("express");
const router = express.Router();
const { loginCheckMiddleware } = require("../middlewares/auth");

//  跟會員中心有關的路由

// 這一個 router 的路由都會先經過這個中間件
router.use(loginCheckMiddleware);

router.get("/", (req, res, next) => {
  res.json(req.member);
});

// 整個 app （整個網站）
// app.use

module.exports = router;
