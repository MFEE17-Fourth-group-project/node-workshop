// Promise 是一個表示非同步運算的「最終」完成或失敗的物件。
//   最終成功
//   最終失敗
//   new Promise
let doWork = function (job, timer, isOK) {
  return new Promise((resolve, reject) => {
    // 模擬一個非同步工作
    console.log("in promise");
    setTimeout(() => {
      let dt = new Date();
      if (isOK) {
        resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      } else {
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

// 沒有達成接續做這個要求

let job1 = doWork("刷牙", 3000, true);
job1.then(
  (result) => {
    console.log("第 1 個函式被呼叫了", result);
  },
  (error) => {
    console.log("第 2 個函式被呼叫了", error);
  }
);

let job2 = doWork("吃早餐", 5000, true);
job2.then(
  (result) => {
    console.log("第 1 個函式被呼叫了", result);
  },
  (error) => {
    console.log("第 2 個函式被呼叫了", error);
  }
);

let job3 = doWork("寫功課", 3000, true);
job3.then(
  (result) => {
    console.log("第 1 個函式被呼叫了", result);
  },
  (error) => {
    console.log("第 2 個函式被呼叫了", error);
  }
);
