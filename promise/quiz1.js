// 請問下列程式碼印出的順序為何？
// 4 1 3 5 2

function syncF() {
  console.log(1);

  setTimeout(() => {
    console.log(2);
  }, 0);

  console.log(3);
}

console.log(4);
syncF();
console.log(5);
