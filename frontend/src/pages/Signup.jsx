import "../assets/styles/auth-forms.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as YUP from "yup";
import axios from "axios";

const Signup = () => {
  const schema = YUP.object().shape({
    name: YUP.string().required("Name is required").max(50),
    email: YUP.string().email().required("Email is required"),
    password: YUP.string().required("Password is required").min(7).max(20),
  });

  const [formData, setFormData] = useState({
    name: "",
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

      let response = await axios.post("http://127.0.0.1:8000/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.message == "Successfully created") {
        navigate("/login");
      } else if (response.data.message == "Already exists"){
        setFormErrors({name : "This name or email is already exists."})
      }
       else {
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
        <h1>Signup</h1>

        <label htmlFor="name" style={{ marginTop: "10px" }}>
          Name :{" "}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name..."
          onChange={handleChange}
        />

        {formErrors.name && (
            <p className="error">{formErrors.name}</p>
        )}

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

        <Link to="/login">Do you have an account? Login here</Link>

        <button type="submit">Signup</button>
      </form>
    </>
  );
};

export default Signup;