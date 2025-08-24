import cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Logout = () => {
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        let response = await axios.post(
          "http://127.0.0.1:8000/api/auth/logout", {} , {
            headers : {
                Authorization : `bearer ${cookies.get("jwt_access_token")}`
            }
          }
        );

        if (response.data.message == "Successfully logged out") {
            cookies.remove("jwt_access_token");
            sleep(1700);
            setIsLogout(true)
        }

      } catch (e) {
        console.log(e);
      }
    };

    handleLogout()

  } , []);

  return (
    <>
        {isLogout && <Navigate to="/login" />}
    </>
  );

};

export default Logout;
