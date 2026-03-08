import React, { useState, useEffect } from "react";
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
import { CircularProgress, Alert } from "@mui/material";
import { InputContainer, ModalButton } from "../signin/Login.styles";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import ReCAPTCHA from "react-google-recaptcha";
// import { getDomainName } from "utils/Utils";
import { NavLink } from "react-router-dom";

const RequestOtp = () => {
  const { isLoading, errorMessage, sessionInfo, passwordResetSucceeded } =
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
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [otpSentMessage, setOtpSentMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const captchaRef = useRef("");
  const [companyName, setCompanyName] = useState("");

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
    if (phoneNumber?.trim()) {
      console.log("triggering send otp");
      setErrors();
      setOtpSentMessage("");
      actions.sendOTP(phoneNumber.trim(), "forgotPassword");
    } else {
      setErrors("Email is required");
    }
    console.log("finished passwordReset submit");
  };

  const handleResetPassword = () => {
    setErrors("");
    actions.clearErrorMessage();

    if (!otpCode?.trim()) {
      setErrors("OTP is required");
      return;
    }
    if (!password || password.length < 6) {
      setErrors("Password should have at least 6 characters");
      return;
    }
    actions.resetPassword(
      phoneNumber?.trim(),
      sessionInfo,
      otpCode.trim(),
      password,
      "forgotPasswordEmail"
    );
  };

  useEffect(() => {
    if (sessionInfo) {
      setOtpSentMessage("OTP sent to the registered email");
    }
  }, [sessionInfo]);

  useEffect(() => {
    if (passwordResetSucceeded) {
      navigate("/", {
        state: {
          redirectMessage: "Password reset succeeded. Please sign in.",
        },
      });
    }
  }, [passwordResetSucceeded, navigate]);

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
          {otpSentMessage && (
            <Alert
              severity="success"
              style={{ marginTop: "12px", marginBottom: "-4px" }}
            >
              {otpSentMessage}
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
        {sessionInfo && (
          <>
            <div>
              <label>OTP</label>
              <input
                name="otp"
                autoComplete="off"
                className="signin-inputfield mb-2"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                type="text"
                required
              />
            </div>
            <div>
              <label>New Password</label>
              <div className="password-input">
                <input
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="signin-inputfield"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <InputContainer>
              <ModalButton data-testid="modalResetPassword" onClick={() => handleResetPassword()}>
                {isLoading ? (
                  <CircularProgress
                    size={16}
                    style={{
                      color: "#ffffff",
                    }}
                  />
                ) : (
                  "Confirm"
                )}
              </ModalButton>
            </InputContainer>
          </>
        )}

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
