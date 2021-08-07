let doWork = function (job, timer, isOK, cb) {
  // Promise 是一個表示非同步運算的最終完成或失敗的物件。
  // 非同步 V
  // 物件 V
  // 最終成功
  // 最終失敗

  // 執行者 -> 承諾的執行者
  let executor = (resolve, reject) => {
    // 非同步
    setTimeout(() => {
      let dt = new Date();
      if (isOK) {
        // 當這個非同物步工作是完成的、是成功的
        // 那我們就呼叫 resolve，並且把結果傳出去
        resolve(`完成工作: ${job} at ${dt.toISOString()}`);
      } else {
        // 當這個非同步工作是失敗的，
        // 那我們就呼叫 reject，把失敗原因傳出去
        reject(`失敗了 ${job}`);
      }
    }, timer);
  };

  return new Promise(executor);
};

let job1 = doWork("刷牙", 3000, true);
// doWork 回傳的東西是？？？ Promise物件
console.log(job1); // => pending
// 用 then() 來接收「然後」的結果
job1.then(
  () => {
    // 準備接收成功的回覆
  },
  () => {
    // 準備接收失敗的回覆
  }
);

let job1 = doWork("刷牙", 3000, true);
console.log(job1); // pending
// doWork 回傳的 promise 物件
let job2 = job1.then((result) => {
  // 處理刷牙的成功後的事
  console.log(result);
  return doWork("吃早餐", 5000, true);
});
// job2 也是一個 promise 物件
console.log(job2); // pending
let job3 = job2.then((result) => {
  // 做吃早餐成功後要做的事
  console.log(result);
  return doWork("寫功課", 3000, true);
});
console.log(job3); // 狀態為 pending 的 Promise 物件
job3.then((result) => {
  // 做寫功課後要做的事
  console.log(result);
});
