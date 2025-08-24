import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
import axios from "axios";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import Logout from "./pages/Logout";
import DeleteAccount from "./pages/DeleteAccount";

function App() {
  const [isUserLogedin , setIsUserLogedin] = useState(false);

  useEffect(() => {
    const checkIsUserLogedin = async () => {
      const jwt_token = cookies.get("jwt_access_token");
      if (jwt_token) {
        try {
          let response = await axios.post(
            "http://127.0.0.1:8000/api/auth/me",
            {},
            {
              headers: {
                Authorization: `bearer ${jwt_token}`,
              },
            }
          );

          if (response.data.id) {
            setIsUserLogedin(true)
          } else if (response.data.messsage == "Unauthorized") {
            setIsUserLogedin(false)
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        setIsUserLogedin(false)
      }
    };

    setIsUserLogedin(checkIsUserLogedin)
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isUserLogedin ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isUserLogedin ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
