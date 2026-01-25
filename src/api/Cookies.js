// import Cookies from "js-cookie";

export default class CustomCookies {
  static setToken(token = {}) {
    const { idToken } = token;
    sessionStorage.setItem("idToken", idToken);
  }

  static getAccessToken() {
    const access_token = sessionStorage.getItem("idToken") || "";
    return access_token && access_token !== "undefined" ? access_token : "";
  }

  static clearTokens() {
    sessionStorage.setItem("idToken", "");
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

  static setRefreshedToken(token = {}) {
    const { access_token, refresh_token, token_type } = token;
    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("refresh_token", refresh_token);
    sessionStorage.setItem("token_type", token_type);
  }

  static getRefreshToken() {
    const refresh_token = sessionStorage.getItem("refresh_token") || "";
    return refresh_token && refresh_token !== "undefined" ? refresh_token : "";
  }

  static hasToken() {
    return Boolean(this.getAccessToken());
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
