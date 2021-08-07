// await / async
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

// async / await
// await 等到後面那個 Promise 物件的狀態變成 fulfilled, rejected
// 最終成功 / 最終失敗 --> await 就是會等到這個「最終」
async function doAllWorks() {
  try {
    let result1 = await doWork("刷牙", 3000, true);
    console.log(result1);
  } catch (e) {}
  try {
    let result2 = await doWork("吃早餐", 5000, false);
    console.log(result2);
    let result3 = await doWork("寫功課", 3000, true);
    console.log(result3);
  } catch (e) {
    console.error(e);
  }
}
doAllWorks();
