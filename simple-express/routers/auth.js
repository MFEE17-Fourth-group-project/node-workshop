const express = require("express");
const router = express.Router();
// nodejs 內建的物件
const path = require("path");
const connection = require("../utils/db");

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
const { BADRESP } = require("dns");
// 通常是為了上傳，所以需要告訴他上傳的檔案存在哪裡
// 通常我們存在硬碟 => diskStorage
const storage = multer.diskStorage({
  // 設定儲存的目的地
  destination: function (req, file, cb) {
    // "/public/uploads"
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  // 檔案命名
  filename: function (req, file, cb) {
    // console.log(file);
    // {
    //   fieldname: 'photo',
    //   originalname: 'rabbit.jpeg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg'
    // }

    // Q. 怎麼取新名字？
    // 檔案的名稱跟放置方式, uuid 或是 datetime(風險: 同一時間有多人上傳)
    // 不要重複、好管理
    // uuid: https://www.npmjs.com/package/uuidv4
    // datetime: Date.now()
    // 為每個功能建立一個檔案夾
    // 會員註冊.. member
    // 評論..   comment
    // 聯絡我們... contact
    // member/11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000.jpg
    // 直接用功能名稱當作檔案 prefix
    // member-11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000.jpg
    // 11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000.jpg

    // Q. 處理副檔名
    // let filenames = "cde.abc.rabbit.jpg".split(".").pop();
    // ["cde", "abc", "rabbit", "jpg"]
    const ext = file.originalname.split(".").pop();

    // cb(error, 新名字)
    cb(null, `member-${Date.now()}.${ext}`);
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
    fileSize: 1024 * 1024,
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

    // 檢查帳號是否重複
    let member = await connection.queryAsync(
      "SELECT * FROM members WHERE email = ?;",
      [req.body.email]
    );
    if (member.length > 0) {
      return next({
        // code: "330002",
        status: 400,
        message: "已經註冊過了",
      });
    }

    // 確認資料有拿到
    console.log(req.body);
    // 確認 file 有拿到(如果 multer 有成功的話)
    console.log(req.file);
    let filename = req.file ? "/uploads/" + req.file.filename : "";
    // http://localhost:3002/uploads/member-1630204166853.jpeg

    // 建立使用者、存進資料庫
    // 密碼不可以是明文
    // bcrypt.hash(明文, salt);
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    let result = await connection.queryAsync(
      "INSERT INTO members (email, password, name, photo) VALUES (?);",
      [[req.body.email, hashPassword, req.body.name, filename]]
    );
    res.json({});
  }
);

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  // - 確認有沒有帳號 (email 是否存在)
  //     - 如果沒有這個帳號，就回覆錯誤(400)
  // 測試:
  //  - 有註冊過的 email V
  //  - 沒有註冊過的 email
  let member = await connection.queryAsync(
    "SELECT * FROM members WHERE email = ?;",
    [req.body.email]
  );
  console.log(member);
  if (member.length === 0) {
    // member 陣列是空的 => 表示沒找到
    return next({
      // code: "330002",
      status: 400,
      message: "找不到帳號",
    });
  }
  // 有找到，而且應該只會有一個（因為我們註冊的地方有檢查 email 有沒有重複）
  member = member[0];
  // - 密碼比對
  // 測試案例
  // - 密碼對的
  // - 密碼錯的
  let result = await bcrypt.compare(req.body.password, member.password);
  if (!result) {
    // - 不一致，回覆錯誤(400)
    return next({
      // code: "330002",
      status: 400,
      message: "密碼錯誤",
    });
  }
  // - 有帳號且密碼正確
  //     - 紀錄 session
  //     - CSR: 回覆成功的訊息
  let returnMember = {
    id: member.id,
    email: member.email,
    name: member.name,
    photo: member.photo,
    isAdmin: false, // 理論上是資料庫要存，但我們假造一下作 demo
  };
  req.session.member = returnMember;
  // 回覆給前端
  res.json({
    name: member.name,
    photo: member.photo,
  });
});

router.get("/logout", (req, res, next) => {
  req.session.member = null;
  res.sendStatus(202);
});

module.exports = router;
