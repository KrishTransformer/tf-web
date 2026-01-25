import React, { useState, useEffect, useRef } from "react";
import { useActions } from "../../app/use-Actions";
import {
  signIn,
  signUp,
  signOut,
  sendOTP,
  resetPassword,
  clearErrorMessage,
} from "../../actions/AuthActions";
import { Navigate, useNavigate } from "react-router-dom";
import { selectAuth } from "../../selectors/AuthSelector";
import { useSelector } from "react-redux";
import CustomCard from "../../components/CustomCard/CustomCard.js";
import { CircularProgress, Alert, Link } from "@mui/material";
import {
  InputContainer,
  Label,
  StyledInput,
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
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [errors, setErrors] = useState();
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
    if (password == confirmPassword) {
      actions.signUp(phoneNumber, password);
    } else {
      setErrors("Passwords not matched");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    if (signUpSucceeded) {
      console.log("signUpSucceeded");
      navigate("/", {
        pathname: `/`,
        state: {
          redirectMessage: "SignUp Succeeded!",
        },
      });
    }
  }, [signUpSucceeded]);

  return (
    <div className="signfullpage">
      <CustomCard companyName={companyName} title="Sign Up">
        <InputContainer>
          {errorMessage?.message && (
            <Alert
              severity="error"
              style={{ marginTop: "12px", marginBottom: "-4px" }}
            >
              {errorMessage?.message}
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
        {/* <div>
        <label>Name</label>
        <input
          autoComplete="off"
          type="text"
          name="name"
          inputProps={{
            maxLength: 40,
          }}
          className="signin-inputfield"
          required
        />
      </div> */}
        <div>
          <label>Email</label>
          <input
            name="name"
            autoComplete="off"
            className="signin-inputfield"
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="text"
            // inputProps={{
            //   minLength: 10,
            //   maxLength: 10,
            // }}
            required
          />
        </div>
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
          <div className="password-input mb-3">
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
