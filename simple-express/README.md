SPA (CSR)

會先要到一個 html，這個 html 一點都不重要，他重點在準備一個 root dom，且載入 react js，從此就把 html dom 交給 react 了。
--> 這時候如果點擊了網頁上的連結，其實是 react 在幫我們置換內容，就沒有像後端發出其他 document 的請求了。
--> 前端路由 路由是由前端(react)控制

SSR:
例如就會有很多頁 PHP --> 就很多 document 的後端路由。

SPA
當我們從首頁點擊 about
/ --> /about ==> 沒有向後端發出任何 document 的 HTTP request （因為它是由 react 來控制路由了 --> 前端）

但是如果我們這時候，在瀏覽器輸入 /about 按下 enter 或是重新整理
--> 他是會整個重刷網頁
--> 會把原本的網頁佔用的資源全部釋放 (react app 整個被釋放掉)
--> 然後重新跟後端要一個新的 html 來
--> 既然往後端打了請求，這時候路由就是由後端控制 (nodejs)
