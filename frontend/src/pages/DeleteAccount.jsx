import "../assets/styles/auth-forms.css";
import axios from "axios";
import cookies from "js-cookie";
import { useState, useContext } from "react";
import { emailContext } from "./Dashboard";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const email = useContext(emailContext);
  const [password , setPassword] = useState("")
  const [error , setError] = useState("")

  const jwt_token = cookies.get("jwt_access_token");

  const navigate = useNavigate()

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()

    console.log("email : " , email)
    console.log("password : " , password)

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/auth/delete-account" , {
            email : email ,
            password : password,
        } , {
            headers : {
                Authorization : `bearer ${jwt_token}`
            }
        });

        if (response.data.message == "Account deleted successfuly") {
            cookies.remove("jwt_access_token");
            sleep(3000)
            navigate("/login")
        } else if (response.data.message == "Email or password is not correct") {
            setError("Email or password is not correct.")
        }

    } catch (e) {
        console.log(e)
    }
  }

  return (
    <form className="auth-form delete-account-form" onSubmit={handleDeleteAccount}>
      <h1>Delete Account Form</h1>

      <label htmlFor="password" style={{ marginTop: "10px" }}>
        Password :{" "}
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter your password..."
        onChange={(e) => setPassword(e.target.value)}
      />

      <p className="error">{error == "" ? "You can't revert your account later !" : error}</p>

      <button type="submit">Delete Account</button>
    </form>
  );
};

export default DeleteAccount;
