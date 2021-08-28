const express = require("express");
const router = express.Router();
// nodejs 內建的物件
const path = require("path");

// 格式驗證 -> 後端絕對不可以相信來自前端的資料！
const { body, validationResult } = require("express-validator");
const registerRules = [
  body("email").isEmail().withMessage("Email 欄位請填寫正確格式"),
  body("password").isLength({ min: 6 }).withMessage("密碼長度至少為 6"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("密碼驗證不一致"),
];
// 為了密碼加密
const bcrypt = require("bcrypt");

// 為了處理 multipart/form-data 需要用到其他中間件
const multer = require("multer");
// 通常是為了上傳，所以需要告訴他上傳的檔案存在哪裡
// 通常我們存在硬碟 => diskStorage
const storage = multer.diskStorage({
  // 設定儲存的目的地
  destination: function (req, file, cb) {
    // "/public/uploads"
    cb(null, path.join(__dirname, "../", "public", "uploads"));
  },
  // 檔案命名
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});
const uploader = multer({
  storage: storage,
  // 檔案驗證(非常重要)
  fileFilter: function (req, file, cb) {
    console.log(file.mimetype);
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/png"
    ) {
      cb(new Error("不接受的檔案型態"), false);
    }
    cb(null, true);
  },
  limits: {
    // 1M: 1024*1024
    // 1K: 1024
    fileSize: 1024,
  },
});

// 一般的 body ==> urlencoded 中間件
// json 的 body ==> json 中間件
// multipart => multer or others

// 建立好註冊路由
// router.post("path", "中間件1(真正的處理函式)")
// router.post("path", "中間件1", "中間件2", "中間件3", ..., "中間件 N (真正的處理函式)")
// /auth/register
router.post(
  "/register",
  // multer 中間件必須放在 validation 中間件前面
  uploader.single("photo"),
  registerRules, // 因為驗證規則需要用到解譯後的資料，所以需要先經過 multer
  async (req, res, next) => {
    const validateResult = validationResult(req);
    // console.log(validateResult);
    // validateResult 不是空的，表示驗證不通過
    if (!validateResult.isEmpty()) {
      // 把錯誤拿出來
      let error = validateResult.array();
      console.log(error);
      // 回覆前端第一個錯誤
      return res
        .status(400)
        .json({ field: error[0].param, message: error[0].msg });
    }
    // 確認資料有拿到
    console.log(req.body);
    // 確認 file 有拿到(如果 multer 有成功的話)
    console.log(req.file);

    // 建立使用者、存進資料庫
    // TODO: 密碼不可以是明文
    // bcrypt.hash(明文, salt)
    // let hashPassword = await bcrypt.hash(req.body.password, 10);
    // let result = await connection.queryAsync(
    //   "INSERT INTO members (email, password, name) VALUES (?);",
    //   [[req.body.email, hashPassword, req.body.name]]
    // );
    res.json({});
  }
);

module.exports = router;
