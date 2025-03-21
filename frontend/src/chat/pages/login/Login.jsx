import React, { useContext, useState, useEffect } from "react";
import "./login.css";
import assets from "../../../assets/assets";
import AxiosToastError from "../../../lib/AxiosToastError";
import Axios from "../../../lib/Axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { summaryAPI } from "../../../common/summaryAPI";

const Login = () => {
  const { setUserData } = useContext(AppContext);
  const [currentState, setCurrentState] = useState("Sign up");
  const [isCheckedBoxChecked, setIsCheckedBoxChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  // ✅ Debugging - Track state changes
  useEffect(() => {
    console.log("Current state:", currentState);
  }, [currentState]);

  // ✅ Toggle between "Login" and "Sign up"
  const toggleState = () => {
    setCurrentState((prevState) => (prevState === "Sign up" ? "Login" : "Sign up"));
  };

  const validValues =
  Object.values(errors).every((err) => err === "") &&
  (currentState === "Login"
    ? data.email.trim() !== "" && data.password.trim() !== "" // ✅ Always enable login button
    : data.username.trim() !== "" &&
      data.email.trim() !== "" &&
      data.password.trim() !== "" &&
      data.phoneNumber.trim() !== "" &&
      isCheckedBoxChecked
  );



  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    let newErrors = { ...errors };

    if (currentState === "Sign up") {  // ✅ Only validate if it's a signup form
        if (name === "username") {
            newErrors.username = value.length < 3 || value.length > 20
                ? "Username should be between 3 and 20 characters"
                : "";
        }

        if (name === "email") {
            newErrors.email = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? "" : "Enter a valid email";
        }

        if (name === "password") {
            const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,16}$/;
            newErrors.password = passwordPattern.test(value)
                ? ""
                : "Password must be 6-16 characters long, with at least one digit & one special character (!@#$%^&*).";
        }
    }

    setErrors(newErrors);
};



  const handlePhoneChange = (value) => {
    setData({ ...data, phoneNumber: value });
  };

  const validatePhoneNumber = () => {
    let newErrors = { ...errors };
    try {
      const phoneNumberParsed = parsePhoneNumberFromString(data.phoneNumber, "NG");
      newErrors.phoneNumber = phoneNumberParsed && phoneNumberParsed.isValid() ? "" : "Invalid phone number";
    } catch (error) {
      newErrors.phoneNumber = "Invalid phone number";
    }
    setErrors(newErrors);
  };

  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...summaryAPI.login,
        data: { email: data.email, password: data.password },
      });
  
      console.log("Login Response:", response.data); // Debugging
  
      if (response.data.error) {
        toast.error(response.data.message, toastOptions);
        return;
      }
  
      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        console.log("Stored Token:", localStorage.getItem("accessToken"));
      }
  
      if (response.data.user) {
        setUserData(response.data.user);
        toast.success("Login successful!", toastOptions);
        setTimeout(() => navigate("/chat"), 1000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      AxiosToastError(error);
    }
  };
  



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentState === "Sign up") {
      try {
        const response = await Axios({ ...summaryAPI.register, data });

        if (response.data.error) {
          toast.error(response.data.message, toastOptions);
        }

        if (response.data.success) {
          toast.success(response.data.message, toastOptions);
          setData({ username: "", email: "", password: "", phoneNumber: "" });
          setCurrentState("Login"); // ✅ Switch to login after successful signup
        }
      } catch (error) {
        AxiosToastError(error);
      }
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{currentState}</h2>

        {currentState === "Sign up" && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={data.username}
              onChange={handleChange}
              className="form-input"
              required
            />
            <span className="error">{errors.username}</span>
          </>
        )}

        <input
          type="email"
          placeholder="Email address"
          name="email"
          value={data.email}
          onChange={handleChange}
          className="form-input"
          required
        />
        {currentState === "Sign up" && <span className="error">{errors.email}</span>}

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={data.password}
          onChange={handleChange}
          className="form-input"
          required
        />
        {currentState === "Sign up" && <span className="error">{errors.password}</span>}

        {currentState === "Sign up" && (
          <>
            <PhoneInput
              country={"ng"}
              inputStyle={{
                width: "100%",
                padding: "12px",
                fontSize: "12px",
                border: "1px solid grey",
                borderRadius: "4px",
                paddingLeft: "45px",
                outlineColor: "#077eff",
              }}
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={handlePhoneChange}
              onBlur={validatePhoneNumber}
            />
            <span className="error">{errors.phoneNumber}</span>

            <div className="login-term">
              <input
                type="checkbox"
                id="terms"
                checked={isCheckedBoxChecked}
                onChange={() => setIsCheckedBoxChecked(!isCheckedBoxChecked)}
              />
              <label htmlFor="terms">I agree to TeaChat's Terms and Conditions and Privacy Policy.</label>
            </div>
          </>
        )}

        <div className="login-forgot">
          <p className="login-toggle">
            {currentState === "Sign up" ? (
              <>Already have an account? <span onClick={toggleState}>Login here</span></>
            ) : (
              <>Create an account <span onClick={toggleState}>Click here</span></>
            )}
          </p>
        </div>

        <button type="submit" disabled={!validValues}>
          {currentState === "Sign up" ? "Create account" : "Login now"}
        </button>
      </form>
    </div>
  );
};

export default Login;
