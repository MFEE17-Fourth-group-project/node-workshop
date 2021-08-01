/* start
 * end
 * Timeout
 *
 * NodeJS is single-thread
 */

console.log("start");

// 誰來等這一秒？？？
setTimeout(function () {
  console.log("Timeout");
}, 0);

console.log("end");
