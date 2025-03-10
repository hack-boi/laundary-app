import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import NewOrder from "./pages/NewOrder";
import OrderStatus from "./pages/OrderStatus";

export const UserContext = createContext({});

function App() {

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
  }, [])

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <div className="flex flex-col min-h-screen">
        {userAuth.access_token && <Navbar />}

        <div className="flex-1">
          <Routes>
            {
              userAuth.access_token ? (
                <Route path="/" element={<Home />} />
              ) : (
                <Route path="/" element={<UserAuthForm type="login" />} />
              )
            }
            <Route path="/register" element={<UserAuthForm type="register" />} />
            <Route path="/new-order" element={<NewOrder />} />
            <Route path="/order/:orderId" element={<OrderStatus />} />
          </Routes>
        </div>

        {userAuth.access_token && <Footer />}
      </div>
    </UserContext.Provider>
  )
}

export default App;
