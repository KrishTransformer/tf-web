import React, { useState, useEffect } from "react";
import { useActions } from "../../app/use-Actions";
import {
  signIn,
  signUp,
  signOut,
  sendOTP,
  resetPassword,
  clearErrorMessage,
} from "../../actions/AuthActions";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../selectors/AuthSelector";
import { useSelector } from "react-redux";
import CustomCard from "../../components/CustomCard/CustomCard.js";
import { CircularProgress, Alert } from "@mui/material";
import {
  InputContainer,
  ModalButton,
} from "../signin/Login.styles";
import "../signin/Signin.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SnackBar from "../../components/snackBar/index.js";
// import { getDomainName } from "utils/Utils";
import { NavLink } from "react-router-dom";
import { selectConfig } from "../../selectors/ConfigSelector";

const SignUp = () => {
  const [openSnakeBar, setOpenSnakeBar] = useState(false);
  // const [signUpType, setSignUpType] = useState("individual");
  const { signUpSucceeded, isLoading, errorMessage, sessionInfo } =
    useSelector(selectAuth);
  const navigate = useNavigate();
  const actions = useActions({
    signIn,
    signUp,
    signOut,
    sendOTP,
    resetPassword,
    clearErrorMessage,
  });
  const [username, setUsername] = useState("");
  const [emailId, setEmailId] = useState("");
  // const [organizationName, setOrganizationName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: configDatafetch } = useSelector(selectConfig);
  
    useEffect(() => {
      actions.clearErrorMessage();
      setCompanyName(configDatafetch?.tenantName);
    }, []);
  
  const handleSubmit = () => {
    setErrors("");
    actions.clearErrorMessage();

    if (!emailId?.trim()) {
      setErrors("Email ID is required");
      return;
    }

    if (!emailId?.includes("@")) {
      setErrors("Email ID is not valid");
      return;
    }

    if (!username?.trim()) {
      setErrors("Username is required");
      return;
    }

    if (
      /\s/.test(username) ||
      /\s/.test(emailId) ||
      /\s/.test(password) ||
      /\s/.test(confirmPassword) ||
      /\s/.test(otp)
    ) {
      setErrors("Spaces are not allowed in Sign Up fields");
      return;
    }

    // if (signUpType === "organization" && !organizationName?.trim()) {
    //   setErrors("Organization Name is required");
    //   return;
    // }

    if (!password || password.length < 6) {
      setErrors("Password should have at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrors("Passwords not matched");
      return;
    }

    if (!otp?.trim()) {
      setErrors("OTP is required");
      return;
    }

    actions.signUp(username.trim(), password, emailId.trim(), otp.trim());
  };

  const handleGetOtp = () => {
    setErrors("");
    actions.clearErrorMessage();
    if (!emailId?.trim()) {
      setErrors("Email ID is required");
      return;
    }
    if (/\s/.test(emailId)) {
      setErrors("Spaces are not allowed in Email ID");
      return;
    }
    if (!emailId?.includes("@")) {
      setErrors("Email ID is not valid");
      return;
    }
    actions.sendOTP(emailId.trim());
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (signUpSucceeded) {
      navigate("/", {
        state: {
          redirectMessage: "Sign Up succeeded. Please sign in.",
        },
      });
    }
  }, [signUpSucceeded, navigate]);

  return (
    <div className="signfullpage">
      <CustomCard
        companyName={companyName}
        title="Sign Up"
      >
        {/* <h3 style={{ 
          color: "#26221f", 
          margin: "5px", 
          fontWeight: 400, 
          fontSize: "1rem", 
          fontFamily: "Philosopher" }} 
          className="text-left">
          {"Sign up as an,"}
        </h3> */}
        <InputContainer>
          {errorMessage && (
            <Alert
              severity="error"
              style={{ marginTop: "12px", marginBottom: "-4px" }}
            >
              {typeof errorMessage === "string"
                ? errorMessage
                : errorMessage?.message || "Sign up failed"}
            </Alert>
          )}
          {errors && (
            <Alert
              severity="error"
              style={{ marginTop: "12px", marginBottom: "-4px" }}
            >
              {errors}
            </Alert>
          )}
        </InputContainer>
        {/* <div className="signup-segment mt-2 mb-3">
          <button
            type="button"
            className={`signup-segment-btn ${
              signUpType === "individual" ? "active" : ""
            }`}
            onClick={() => setSignUpType("individual")}
          >
            Individual
          </button>
          <button
            type="button"
            className={`signup-segment-btn ${
              signUpType === "organization" ? "active" : ""
            }`}
            onClick={() => setSignUpType("organization")}
          >
            Organization
          </button>
        </div> */}
        <div>
          <label>Username</label>
          <input
            name="username"
            autoComplete="off"
            className="signin-inputfield"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required
          />
        </div>
        {/* {signUpType === "organization" && (
          <div>
            <label>Organization Name</label>
            <input
              name="organizationName"
              autoComplete="off"
              className="signin-inputfield"
              onChange={(e) => setOrganizationName(e.target.value)}
              type="text"
              required
            />
          </div>
        )} */}
        <div>
          <label>Password</label>
          <div className="password-input">
            <input
              autoComplete="off"
              type={showPassword ? "text" : "password"}
              name="password"
              className="signin-inputfield"
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{
                maxLength: 40,
              }}
              required
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : < FaEyeSlash />}
            </button>
          </div>
        </div>
        <div>
          <label>Confirm Password</label>
          <div className="password-input mb-2">
            <input
              autoComplete="off"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="signin-inputfield"
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputProps={{
                maxLength: 40,
              }}
              required
            />
            <button type="button" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? < FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <div>
          <label>Email ID</label>
          <div className="d-flex align-items-center gap-2">
            <input
              name="email"
              autoComplete="off"
              className="signin-inputfield mb-2"
              value={emailId}
              onChange={(e) => {
                setEmailId(e.target.value);
              }}
              type="text"
              required
            />
            <button
              type="button"
              className="otp-btn mb-2"
              onClick={handleGetOtp}
            >
              Get OTP
            </button>
          </div>
          {sessionInfo && (
            <p className="otp-note">
              OTP was requested successfully. You can continue signup.
            </p>
          )}
        </div>
        <div>
          <label>OTP</label>
          <input
            name="otp"
            autoComplete="off"
            className="signin-inputfield mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            required
          />
        </div>
        <InputContainer>
          <ModalButton
            data-testid="modalConfirm"
            onClick={() => handleSubmit()}
            autoFocus
          >
            {isLoading ? (
              <CircularProgress
                size={16}
                style={{
                  color: "#ffffff",
                }}
              />
            ) : (
              "Sign Up"
            )}
          </ModalButton>
        </InputContainer>
        <div className="d-flex justify-content-center mt-3">
          <div className="d-flex">
            <h6 className="signin-subtext">Exsisting User ? &nbsp;</h6>
            <NavLink to="/" className="signin-subtext1">
              Sign In
            </NavLink>
          </div>
        </div>
        <SnackBar open={openSnakeBar} message="SignUp Completed Succussfully" />
      </CustomCard>
    </div>
  );
};

export default SignUp;
