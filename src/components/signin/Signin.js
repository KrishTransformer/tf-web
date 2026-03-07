import React, { useState, useEffect } from "react";
import { useActions } from "../../app/use-Actions.js";
import { signIn, signOut, clearErrorMessage } from "../../actions/AuthActions.js";
import { fetchConfig } from "../../actions/ConfigActions";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { selectAuth } from "../../selectors/AuthSelector.js";
import { useSelector } from "react-redux";
import CustomCard from "../../components/CustomCard/CustomCard.js";
import { CircularProgress, Alert } from "@mui/material";
import {
  InputContainer,
  ModalButton,
} from "./Login.styles.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signin.css";
import { fetchEntity } from "../../actions/EntityActions";
import { extractFromHostname } from "../../utils/StringUtils.js";

const Login = () => {
  const [redirectMessage, setRedirectMessage] = useState("");
  const { isAuthenticated, isLoading, errorMessage } = useSelector(selectAuth);
  const [errors, setErrors] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const actions = useActions({
    signIn,
    signOut,
    clearErrorMessage,
    fetchConfig,
    fetchEntity
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  console.log("user",username,password);
  useEffect(() => {
    actions.clearErrorMessage();
    const hostname = window.location.hostname;
    console.log("hostname",hostname);
    const extracted = extractFromHostname(hostname);
    console.log(extracted);
    setCompanyName(extracted);
  }, []);

  useEffect(() => {
    if (location.state?.redirectMessage) {
      setRedirectMessage(location.state.redirectMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated]);

  const handleSignIn = () => {
    //navigate("/home");
    setRedirectMessage("");
    actions.clearErrorMessage();
    setErrors("");
    if (username?.length == 0 || password?.length == 0) {
      setErrors("Please fill out all fields.");
    } else {
      if (password == undefined || password?.length < 6) {
        setErrors("Password should have atleast 6 characters");
      } else {
        actions.signIn(username, password);
      }
    }
  };

  return (
    <div className="signfullpage">
      <CustomCard 
        // companyName={companyName}
        companyName={"K R I S H"} 
        companyNameExt={"Transformer Design Software"}
        title="Sign In"
        titleStyle={{ fontWeight: 400, fontSize: "1.5rem" }}
      >
        <InputContainer>
          {errorMessage && (
            <Alert
              severity="error"
              style={{
                marginTop: "12px",
                marginBottom: "-4px",
                fontSize: "13px",
              }}
            >
              {errorMessage}
            </Alert>
          )}
          {errors && (
            <Alert
              severity="error"
              style={{
                marginTop: "12px",
                marginBottom: "-4px",
                fontSize: "13px",
              }}
            >
              {errors}
            </Alert>
          )}
          {redirectMessage && redirectMessage != "" && (
            <Alert
              severity="success"
              style={{
                marginTop: "12px",
                marginBottom: "-4px",
                fontSize: "13px",
              }}
            >
              {redirectMessage}
            </Alert>
          )}
        </InputContainer>
        <div>
          <label>Username / Email</label>
          <input
            autoComplete="off"
            type="text"
            name="name"
            className="signin-inputfield"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <div className="password-input mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="signin-inputfield"
              required
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? < FaEye/> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <InputContainer>
          <ModalButton
            data-testid="modalConfirm"
            autoFocus
            onClick={() => handleSignIn()}
          >
            {isLoading ? (
              <CircularProgress
                size={16}
                style={{
                  color: "#ffffff",
                }}
              />
            ) : (
              "Sign In"
            )}
          </ModalButton>
        </InputContainer>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <NavLink to="/forgotPassword" className="signin-subtext1">
            Forgot Password?
          </NavLink>
          <div className="d-flex align-items-center">
            <h6 className="signin-subtext mb-0">Not Registered? &nbsp;</h6>
            <NavLink to="/signUp" className="signin-subtext1">
              Sign Up
            </NavLink>
          </div>
        </div>
      </CustomCard>
    </div>
  );
};

export default Login;
