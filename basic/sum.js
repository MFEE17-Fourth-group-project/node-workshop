console.log("Hello World");

/*
演算法
  - 時間複雜度
  - 空間複雜度

*/

// 回傳 1 + 2 + ... + n 的結果
function sum1(n) {
  // n = 10 ==> 1
  // n = 1000 => 1
  // O(1) 不管 n 是多少，執行速度是一個"常數"
  return ((n + 1) * n) / 2;
}

// 團隊裡的程式看起來都像同一個人寫
// n = 10   ==> 10 秒
// n = 100  ==> 100 秒
// n = 1000 ==> 1000 秒
// 成正比的關係
// O(n) <--- O(n) O(2n) O(3n)
function sum2(n) {
  let result = 0;
  for (var i = 1; i <= n; i++) {
    result += i;
  }
  return result;
}

console.log(sum1(1), sum2(1)); // 1
console.log(sum1(2), sum2(2)); // 3
console.log(sum1(10), sum2(10)); // 55

// 壓力測試
console.time("SUM1");
for (let i = 1; i <= 10000; i++) {
  sum1(100000);
}
console.timeEnd("SUM1");

console.time("SUM2");
for (let i = 1; i <= 10000; i++) {
  sum2(100000);
}
console.timeEnd("SUM2");

// O(1) 比 O(n)

// 在數字比較小的情況下
// SUM1: 23.712ms
// SUM2: 21.207ms
// SUM1: 1.278ms
// SUM2: 2.709ms

// 在數字很大的情況下
// SUM1: 1.473ms
// SUM2: 1.285s

// 空間
// arr = [1,2,3,4,5]
// O(1), O(n)
// 用空間換取時間
