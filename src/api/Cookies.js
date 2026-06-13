// import Cookies from "js-cookie";

export default class CustomCookies {
  static setAuthRedirectMessage(value) {
    sessionStorage.setItem("auth_redirect_message", value || "");
  }

  static getAuthRedirectMessage() {
    return sessionStorage.getItem("auth_redirect_message") || "";
  }

  static clearAuthRedirectMessage() {
    sessionStorage.removeItem("auth_redirect_message");
  }

  static setAuthCode(value) {
    sessionStorage.setItem("code", value);
  }

  static getAuthCode() {
    return sessionStorage.getItem("code");
  }

  static setUserId(value) {
    sessionStorage.setItem("user_id", value);
  }

  static getUserId() {
    return sessionStorage.getItem("user_id");
  }

  static setCodeVerifier(value) {
    sessionStorage.setItem("code_verifier", value);
  }

  static getCodeVerifier() {
    return sessionStorage.getItem("code_verifier");
  }

  static setCodeChallenge(value) {
    sessionStorage.setItem("code_challenge", value);
  }

  static getCodeChallenge() {
    return sessionStorage.getItem("code_challenge");
  }

  static setMerchantTransactionId(value) {
    sessionStorage.setItem("mer_tran_id", value);
  }

  static getMerchantTransactionId() {
    return sessionStorage.getItem("mer_tran_id");
  }

  static setMerchantId(value) {
    sessionStorage.setItem("mer_id", value);
  }

  static getMerchantId() {
    return sessionStorage.getItem("mer_id");
  }

}
