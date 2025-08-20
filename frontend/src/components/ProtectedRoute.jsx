import { useState, useEffect } from "react";
import cookies from "js-cookie";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [isUserLogedin, setIsUserLogedin] = useState("loading");
  const jwt_token = cookies.get("jwt_access_token");

  useEffect(() => {
    const checkIsUserLogedin = async () => {
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
          setIsUserLogedin("yes");
        } else {
          setIsUserLogedin("no");
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (jwt_token) {
      checkIsUserLogedin();
    } else {
      setIsUserLogedin("no");
    }
  });

  if (isUserLogedin === "loading") {
    return <div>Checking...</div>;
  }

  if (isUserLogedin === "no") {
    return <Navigate to="/login" />;
  }

  if (isUserLogedin == "yes") {
    return <Outlet />;
  }
};

export default ProtectedRoute;
