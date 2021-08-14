const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello");
});

server.listen(3000, () => {
  console.log("我們的 web server 啟動了～");
});
