function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  let result = square(n);
  console.log(result);
  // return;
}

printSquare(4);

// printSquare(15) -> L9 -> L10 -> L5 -> L6 -> L1 -> L2
// L6 -> L10 -> L11 -> (L12) -> L15
// call stack
