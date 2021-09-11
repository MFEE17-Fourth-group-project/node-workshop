import { Link, NavLink, matchPath } from "react-router-dom";
import Logo from "../img/fish.png";
import { API_URL, IMAGE_URL } from "../utils/config";
import axios from "axios";
import { useAuth } from "../context/auth";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const Navbar = () => {
  const { member, setMember } = useAuth();

  const handleLogout = async () => {
    await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true,
    });
    setMember(null);
  };

  // 在前端 FB 驗證完後之後，會呼叫的函式
  let facebookResponse = async (response) => {
    let result = await axios.post(
      `${API_URL}/auth/facebook`,
      {
        access_token: response.accessToken,
      },
      {
        withCredentials: true,
      }
    );
    console.log(result);
    // 跟一般登入後續處理是一樣的
    setMember(result.data);
  };

  const googleResponse = async (response) => {
    let result = await axios.post(
      `${API_URL}/auth/google`,
      {
        access_token: response.accessToken,
      },
      {
        withCredentials: true,
      }
    );
    console.log(result);
    // 跟一般登入後續處理是一樣的
    setMember(result.data);
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <nav className="bg-indigo-100 px-10 py-3 flex justify-between items-center sticky shadow">
      <div className="flex items-center cursor-pointer">
        <img src={Logo} width="50" alt="Logo" className="mr-2" />
        <span className="text-2xl text-gray-700 text-opacity-70">魚股市</span>
      </div>

      <div className="flex items-center ">
        <NavLink
          to="/"
          className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
          activeStyle={{ fontWeight: "bold", color: "#3B82F6" }}
          isActive={(match, location) => {
            if (!match) {
              return false;
            }
            // console.log(match);

            const paramMath = matchPath(location.pathname, {
              path: "/stock/:stock_id",
              exact: true,
              strict: false,
            });

            // only consider an event active if its event id is an odd number
            return match.isExact || paramMath;
          }}
        >
          股票
        </NavLink>
        <NavLink
          to="/about"
          className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
          activeStyle={{ fontWeight: "bold", color: "#3B82F6" }}
        >
          關於
        </NavLink>
        {member ? (
          <>
            Hi, {member.name}
            <img
              src={`${IMAGE_URL}${member.photo}`}
              style={{ width: "80px" }}
            />
            <Link
              to="/about"
              onClick={handleLogout}
              className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
            >
              登出
            </Link>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
              activeStyle={{ fontWeight: "bold", color: "#3B82F6" }}
            >
              登入
            </NavLink>
            <NavLink
              to="/register"
              className="text-xl text-gray-700 text-opacity-70 mx-3 md:mx-6 hover:text-opacity-90"
              activeStyle={{ fontWeight: "bold", color: "#3B82F6" }}
            >
              註冊
            </NavLink>
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_ID}
              autoLoad={false}
              callback={facebookResponse}
            />
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_ID}
              buttonText="Login"
              onSuccess={googleResponse}
              onFailure={onFailure}
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
