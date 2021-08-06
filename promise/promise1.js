// Promise 是一個表示非同步運算的「最終」完成或失敗的物件。
//   最終成功
//   最終失敗
//   new Promise
let doWork = function (job, timer, isOK) {
  // 解決 callback hell:
  // ==> 把 callback -> 改用 Promise
  // 物件： new Promise();
  // 建構式一定要傳入一個函式，而且這個函式本身會有兩個參數
  // resolve, reject
  return new Promise((resolve, reject) => {
    // 模擬一個非同步工作
    console.log("in promise");
    setTimeout(() => {
      let dt = new Date();
      if (isOK) {
        // 完成
        // cb(null, `完成工作: ${job} at ${dt.toISOString()}`);
        resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      } else {
        // 失敗
        // cb(`失敗了 ${job}`, null);
        reject(`失敗了 ${job}`);
      }
    }, timer);
  });
};

let dt = new Date();
console.log(`開始工作 at ${dt.toISOString()}`);
// 刷牙 -> 吃早餐 -> 寫功課

// 解決: 接續做的工作
// ---> 動作如果要接續著做，只能把下一個動作放在上一個動作的 callback
//   --> callback hell

let job1 = doWork("刷牙", 3000, false);
console.log(job1);
job1.then(
  function (resolve) {
    console.log("第 1 個函式被呼叫了", resolve);
  },
  function (reject) {
    console.log("第 2 個函式被呼叫了", reject);
  }
);

// doWork("刷牙", 3000, false, function (err, data) {
//   // 刷完牙後會被回呼的函式
//   // 會在這裡就是已經刷完牙了
//   if (err) {
//     console.error("發生錯誤了:", err);
//   } else {
//     console.log(data);
//     doWork("吃早餐", 5000, true, function (err, data) {
//       // 在這裡，就是已經吃完早餐了！
//       if (err) {
//         console.error("發生錯誤了:", err);
//       } else {
//         console.log(data);
//         doWork("寫功課", 3000, true, function (err, data) {
//           if (err) {
//             console.error("發生錯誤了:", err);
//           } else {
//             console.log(data);
//           }
//         });
//       }
//     });
//   }
// });
