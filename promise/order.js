console.log(1);

// 1(同) 4(同) end(同) 5(micro) 2(macro Timer) 7(micro) 6(macro Timer)

// Timer Q > Check Q (setImmediate)
setImmediate(() => {
  // 因為是被放在 Check Q(macro)且優先權又低於 Timer Q
  console.log("Imme");
});

setTimeout(() => {
  // --> macro Q
  console.log(2);
  // 立刻 resolve
  Promise.resolve(7).then((result) => {
    console.log(result); // 7 --> micro Q
  });
}, 0);

new Promise((resolve, reject) => {
  console.log(4);
  resolve(5);
}).then((result) => {
  // --> micro Q
  console.log(result); // 5
});

setTimeout(() => {
  // --> macro Q
  console.log(6);
}, 0);

console.log("end");

// 1 4 end 5 2 7 6
// 5 先做，是因為 promise 是 micro q
// 2, 6 都是 macro，基於 FIFO，所以 2 先做
// 執行任務 2 的時候，又製造了一個 micro task (7)
// 當 macro 任務2 執行完畢的時候，會去檢查 micro Q
// 因為有，所以得先執行 micro task ==> 7
// micro task queue 都空了，才繼續執行 macro task queue 的最後一個
// --> 6

// micro 會優先於 macro
// 每做完一個 macro task 都要回頭檢查一次 micro 有沒有要做
