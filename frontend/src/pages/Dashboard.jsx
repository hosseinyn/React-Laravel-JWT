import "../assets/styles/dashboard.css";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [accountCreatedDate, setAccountCreatedDate] = useState("");

  const jwt_token = cookies.get("jwt_access_token");

  useEffect(() => {
    const getUserInfo = async () => {
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
            setUsername(response.data.name);
            setEmail(response.data.email);
            const userCreatedDate = response.data.created_at;

            let date = new Date(userCreatedDate);
            setAccountCreatedDate(date.toDateString())
        } else {
            console.log(response.data)
        }

      } catch (e) {
        console.log(e);
      }
    };

    getUserInfo()

  } , []);

  return (
    <>
      <div className="dashboard">
        <h1>Welcome {username} !</h1>
        <h3>Your email : {email}</h3>
        <h3>You have your account from : {accountCreatedDate}</h3>

        <div className="dashboard-buttons">
            <Link to="/change-password">
                <button className="green-button">Change Password</button>
            </Link>

            <Link to="/logout">
                <button className="orange-button">Log Out</button>
            </Link>

            <form>
                <button type="submit" className="red-button">Delete Account</button>
            </form>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
