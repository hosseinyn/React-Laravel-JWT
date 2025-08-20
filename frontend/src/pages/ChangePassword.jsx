import "../assets/styles/auth-forms.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as YUP from "yup";
import axios from "axios";
import cookies from "js-cookie";

const ChangePassword = () => {
  const navigate = useNavigate();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const schema = YUP.object().shape({
    name: YUP.string().required("Name is required"),
    current_password: YUP.string()
      .required("Current password is required")
      .min(7)
      .max(20),
    new_password: YUP.string()
      .required("New password is required")
      .min(7)
      .max(20),
    confirm_new_password: YUP.string()
      .required("Current password is required")
      .min(7)
      .max(20)
      .oneOf([YUP.ref("new_password"), null], "Passwords must match"),
  });

  const [formData, setFormData] = useState({
    name: "",
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [formErrors, setFormErrors] = useState({});

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

      let response = await axios.post(
        "http://127.0.0.1:8000/api/auth/change-password",
        {
          name: formData.name,
          current_password: formData.current_password,
          new_password: formData.new_password,
        }
      );

      if (response.data.message == "Password changed successfully") {
        cookies.remove("jwt_access_token");
        await sleep(1500);
        navigate("/login");
      } else if (response.data.message == "Current password is not correct") {
        setFormErrors({ current_password: "Current password is not correct." });
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
        <h1>Change Password</h1>

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

        {formErrors.name && <p className="error">{formErrors.name}</p>}

        <label htmlFor="current_password">Current Password : </label>
        <input
          type="password"
          id="current_password"
          name="current_password"
          placeholder="Enter current password..."
          onChange={handleChange}
        />

        {formErrors.current_password && (
          <p className="error">{formErrors.current_password}</p>
        )}

        <label htmlFor="new_password">New Password : </label>
        <input
          type="password"
          id="new_password"
          name="new_password"
          placeholder="Enter new password..."
          onChange={handleChange}
        />

        {formErrors.new_password && (
          <p className="error">{formErrors.new_password}</p>
        )}

        <label htmlFor="confirm_new_password">Confirm New Password : </label>
        <input
          type="password"
          id="confirm_new_password"
          name="confirm_new_password"
          placeholder="Repeat new password..."
          onChange={handleChange}
        />

        {formErrors.confirm_new_password && (
          <p className="error">{formErrors.confirm_new_password}</p>
        )}

        <button type="submit">Change</button>
      </form>
    </>
  );
};

export default ChangePassword;
