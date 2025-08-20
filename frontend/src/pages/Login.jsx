import "../assets/styles/auth-forms.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as YUP from "yup";
import axios from "axios";
import cookies from "js-cookie";

const Login = () => {
  const schema = YUP.object().shape({
    email: YUP.string().email().required("Email is required"),
    password: YUP.string().required("Password is required").min(7).max(20),
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      setFormErrors({});

      let response = await axios.post("http://127.0.0.1:8000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const response_access_token = response.data.access_token;

      if (response_access_token) {
        cookies.set("jwt_access_token", response_access_token);
        navigate("/dashboard");
      } else {
        console.log(response.data);
      }
    } catch (errors) {
      console.log(errors);
      const newErrors = {};
      errors.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setFormErrors(newErrors);
    }
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <label htmlFor="email" style={{ marginTop: "10px" }}>
          Email :{" "}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email..."
          onChange={handleChange}
        />

        {formErrors.email && (
            <p className="error">{formErrors.email}</p>
        )}

        <label htmlFor="password">Password : </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password..."
          onChange={handleChange}
        />

        {formErrors.password && (
            <p className="error">{formErrors.password}</p>
        )}

        <Link to="/signup">Don't have an account? Signup here</Link>

        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
