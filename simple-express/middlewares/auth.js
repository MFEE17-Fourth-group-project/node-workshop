const jwt = require("jsonwebtoken");

module.exports = {
  // authentication
  loginCheckMiddleware: function (req, res, next) {
    // 要登入後才可以看
    const rawToken = req.header("Authorization");
    if (rawToken) {
      // "Bearer " + token
      const token = rawToken.replace("Bearer ", "");
      console.log("取得的 token", token);
      try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.member = data;
        return next();
      } catch (e) {}
    }
    return next({
      status: 401,
      message: "登入會員後，即可以享受更多專屬功能",
    });
  },
  // authorization 授權
  isAdminMiddleware: function (req, res, next) {
    if (req.session.member.isAdmin) {
      // 是 admin
      next();
    } else {
      return next({
        status: 403,
        message: "你沒有管理員權限喔",
      });
    }
  },
};

// return module.exports
