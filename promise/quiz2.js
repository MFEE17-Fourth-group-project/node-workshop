// 有await: 4 -> 1 -> A -> 5 -> 2 -> 3
// 無await: 4 -> 1 -> A -> 3 -> 5 -> 2
async function asyncF() {
  console.log(1);
  // await 暫停鍵
  await new Promise((resolve, reject) => {
    console.log("A");
    // 非同步 --> single-thread 還是要去把工作交接出去
    setTimeout(() => {
      console.log(2);
      resolve();
      // reject
    }, 0);
  });
  console.log(3);
}
console.log(4);
asyncF();
console.log(5);
