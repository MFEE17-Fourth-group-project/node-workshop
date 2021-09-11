import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Stock from "./components/Stock";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import StockDetails from "./components/StockDetails";
import NotFound from "./components/NotFound";
import { AuthContext } from "./context/auth";
import { API_URL } from "./utils/config";
import axios from "axios";

function App() {
  const [member, setMember] = useState(null);
  const [token, setToken] = useState(null);

  const setAuthMember = (m) => {
    setMember(m);
  };

  const setJWTToken = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  useEffect(() => {
    // 把 token 從 localStorage 中讀出來存在 context 裡
    const token = localStorage.getItem("token");
    if (token) {
      console.log("讀出token", token);
      setToken(token);
      // 預設 axios 都會帶著 token
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    // 每次重新整理或開啟頁面時，都去確認一下是否在已經登入的狀態。
    const getMember = async () => {
      try {
        let result = await axios.get(`${API_URL}/member`);
        setMember(result.data);
      } catch (e) {}
    };
    getMember();
  }, []);

  return (
    <AuthContext.Provider
      value={{ member, setMember: setAuthMember, token, setToken: setJWTToken }}
    >
      <Router>
        <div className="App">
          <Navbar />
        </div>
        <Switch>
          <Route path="/" exact>
            <Stock />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/stock/:stockId/:currentPage?">
            <StockDetails />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
