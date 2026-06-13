const ID_TOKEN_KEY = "idToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getIdToken = () => {
  const token = sessionStorage.getItem(ID_TOKEN_KEY) || "";
  return token && token !== "undefined" ? token : "";
};

export const getRefreshToken = () => {
  const token =
    sessionStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem("refresh_token") ||
    "";
  return token && token !== "undefined" ? token : "";
};

export const setAuthTokens = (token = {}) => {
  const idToken = token?.idToken || "";
  const refreshToken = token?.refreshToken || "";

  sessionStorage.setItem(ID_TOKEN_KEY, idToken);

  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearAuthTokens = () => {
  sessionStorage.setItem(ID_TOKEN_KEY, "");
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};
