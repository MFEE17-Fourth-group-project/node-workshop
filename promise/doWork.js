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
