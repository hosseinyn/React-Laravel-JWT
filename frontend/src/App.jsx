import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
import axios from "axios";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
            return true;
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    setIsUserLogedin(checkIsUserLogedin)
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isUserLogedin ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isUserLogedin ? <Navigate to="/dashboard" /> : <Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
