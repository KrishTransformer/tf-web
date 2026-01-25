import React, { useState, useEffect, useRef } from "react";
import { useActions } from "../../app/use-Actions";
import {
  signIn,
  signOut,
  sendOTP,
  resetPassword,
  clearErrorMessage,
} from "../../actions/AuthActions";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../selectors/AuthSelector";
import { useSelector } from "react-redux";
import { selectConfig } from "../../selectors/ConfigSelector";
import CustomCard from "../../components/CustomCard/CustomCard";
import { CircularProgress, Alert, Link } from "@mui/material";
import {
  InputContainer,
  Label,
  StyledInput,
  ModalButton,
} from "../signin/Login.styles";
// import ReCAPTCHA from "react-google-recaptcha";
// import { getDomainName } from "utils/Utils";
import { NavLink } from "react-router-dom";

const RequestOtp = () => {
  const { isAuthenticated, isLoading, errorMessage, sessionInfo } =
    useSelector(selectAuth);
  const navigate = useNavigate();
  const actions = useActions({
    signIn,
    signOut,
    sendOTP,
    resetPassword,
    clearErrorMessage,
  });
  const [phoneNumber, setPhoneNumber] = useState();
  const [errors, setErrors] = useState();
  // const captchaRef = useRef("");
  const [companyName, setCompanyName] = useState("");
  const handleSignIn = () => {
    navigate("/signIn");
  };

  useEffect(() => {
    actions.clearErrorMessage();
    console.log("loading page sendOtp ");
    // if (captchaRef.current.getWidgetId()) {
    // 	window.location.reload(false);
    // }
    setCompanyName(configDatafetch?.tenantName);
  }, []);
  const { data: configDatafetch } = useSelector(selectConfig);

  const handleSubmit = () => {
    console.log("clicked sendotp submit");
    const token = "done";
    console.log(token);

    if (token) {
      console.log("triggering send otp");
      setErrors();
      actions.sendOTP("+91" + phoneNumber, token);
      // captchaRef.current.reset();
    } else {
      console.log("enter recatcha token");
      setErrors("Check the reCaptcha button");
    }
    console.log("finished passwordReset submit");
  };

  useEffect(() => {
    if (sessionInfo) {
      console.log("received sessionInfo");
      navigate("/password-reset", {
        state: {
          phoneNumber,
        },
      });
    }
  }, [sessionInfo]);

  return (
    <div className="signfullpage">
      <CustomCard title="Forgot Password?" companyName={companyName}>
        <InputContainer>
          {errorMessage?.error?.message && (
            <Alert
              severity="error"
              style={{ marginTop: "12px", marginBottom: "-4px" }}
            >
              {errorMessage?.error?.message}
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
        <div>
          <label>Email</label>
          <input
            name="name"
            autoComplete="off"
            className="signin-inputfield mb-3"
            onChange={(e) => setPhoneNumber(e.target.value)}
             type="text"
            // inputProps={{
            //   minLength: 10,
            //   maxLength: 10,
            // }}
            required
          />
        </div>

        {/* <InputContainer>
				<ReCAPTCHA
					width="100%"
					sitekey="6LcMZR0UAAAAALgPMcgHwga7gY5p8QMg1Hj-bmUv"
					ref={captchaRef}
					size="normal"
					badge="inline"
				/>
			</InputContainer> */}
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
              "Send OTP"
            )}
          </ModalButton>
        </InputContainer>

        <div className="d-flex justify-content-center mt-3">
          <div className="d-flex">
            <h6 className="signin-subtext">Back to SignIn? &nbsp;</h6>
            <NavLink to="/" className="signin-subtext1">
              Sign In
            </NavLink>
          </div>
        </div>
      </CustomCard>
    </div>
  );
};

export default RequestOtp;
