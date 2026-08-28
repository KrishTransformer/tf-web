import axios from "axios";
import CustomCookies from "./Cookies";
import { clearAuthTokens, getIdToken, getRefreshToken, setAuthTokens } from "./authToken";
import { COMMON_SERVICE } from "../constants/CommonConstants";
import { sanitizeEntityPayload } from "../utils/entityPayload";

const instance = axios.create({
  withCredentials: false,
});

let refreshRequest;

const getTokenIdentity = (token) => {
  try {
    const payload = JSON.parse(window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.email || payload.preferred_username || payload.username || "";
  } catch (error) {
    return "";
  }
};

const expireSession = () => {
  clearAuthTokens();
  CustomCookies.setAuthRedirectMessage("Session expired. Please log in again.");
  redirectToLogin();
};

const refreshIdToken = () => {
  if (refreshRequest) {
    return refreshRequest;
  }

  const idToken = getIdToken();
  const refreshToken = getRefreshToken();
  const identity = getTokenIdentity(idToken);

  if (!identity || !refreshToken) {
    return Promise.reject(new Error("No refresh session is available."));
  }

  const authorization = `Basic ${window.btoa(`${identity}:${refreshToken}`)}`;
  refreshRequest = instance
    .post(`${commonServiceConfig.API_URL}/auth/signInWithRefreshToken`, null, {
      headers: { Authorization: authorization },
    })
    .then((response) => {
      const refreshedIdToken = response.data?.idToken || response.data?.id_token;
      const refreshedRefreshToken =
        response.data?.refreshToken || response.data?.refresh_token || refreshToken;

      if (!refreshedIdToken) {
        throw new Error("The refresh response did not include an ID token.");
      }

      setAuthTokens({ idToken: refreshedIdToken, refreshToken: refreshedRefreshToken });
      return refreshedIdToken;
    })
    .finally(() => {
      refreshRequest = undefined;
    });

  return refreshRequest;
};

instance.interceptors.request.use(async (config) => {
  if (!config.headers) {
    config.headers = {};
  }

  if (config.headers["X-Skip-Auth"] === "true") {
    delete config.headers["X-Skip-Auth"];
    delete config.headers.Authorization;
    delete config.headers.authorization;
    return config;
  }

  if (!config.headers.Authorization) {
    const token = getIdToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async function (error) {
    const originalRequest = error?.config;
    const authorizationHeader =
      originalRequest?.headers?.Authorization || originalRequest?.headers?.authorization || "";
    const isBearerRequest =
      typeof authorizationHeader === "string" && authorizationHeader.startsWith("Bearer ");

    if (error.response && [401, 403].includes(error.response.status) && isBearerRequest) {
      if (originalRequest?._retryAfterRefresh) {
        expireSession();
        return Promise.reject(error);
      }

      try {
        const refreshedIdToken = await refreshIdToken();
        originalRequest._retryAfterRefresh = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${refreshedIdToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        expireSession();
      }
    }
    return Promise.reject(error);
  }
);

const protocol = window.location.protocol + "//";
const fullUrl = window.location.host;


export const commonService = {
  prod: {
    API_URL: "https://tf-common-service.trafointel.com/tf/api/" + fullUrl,
  },
  local: {
    API_URL: "https://tf-common-service.trafointel.com/tf/api/design.trafointel.com",
  },
};

export const coreService = {
  prod: {
    API_URL: "https://tf-core-service.trafointel.com/tf/api/" + fullUrl,
  },
  local: {
    API_URL: "https://tf-core-service.trafointel.com/tf/api/" + fullUrl,
  },
};


export const cadService = {
  prod: {
    API_URL: "https://tf-cad-service.trafointel.com",
  },
  local: {
    API_URL: "https://tf-cad-service.trafointel.com",
  },
};

export const multiWdgService = {
  prod: {
    API_URL: "https://multiwdg-backend.trafointel.com",
  },
  local: {
    API_URL: "https://multiwdg-backend.trafointel.com",
  },
};


export const storageService = {
  prod: {
    API_URL: "",
  },
  local: {
    API_URL: "",
  },
};

const redirectToLogin = () => {
  window.location.href = protocol + fullUrl;
};

const getEnvironment = (key) => {
  if (process.env.NODE_ENV === "development") {
    return key["local"];
  }
  if (process.env.NODE_ENV === "production") {
    return key["prod"];
  }
  return key["local"];
};

export const coreServiceConfig = getEnvironment(coreService);
export const commonServiceConfig = getEnvironment(commonService);
export const cadServiceConfig = getEnvironment(cadService);
export const multiWdgServiceConfig = getEnvironment(multiWdgService);
export const storageServiceConfig = getEnvironment(storageService);

const BASE_URL = {
  CORE_SERVICE: coreServiceConfig.API_URL,
  COMMON_SERVICE: commonServiceConfig.API_URL,
  CAD_SERVICE: cadServiceConfig.API_URL,
  MULTI_WDG_SERVICE: multiWdgServiceConfig.API_URL,
  STORAGE_SERVICE: storageServiceConfig.API_URL,
};

const getBaseUrl = (serviceType) => {
  return serviceType ? BASE_URL[serviceType] : BASE_URL.CORE_SERVICE;
};

export const getApi = (
  path,
  serviceType,
  params = {},
  headers = { Accept: "application/json", "Content-Type": "application/json" },
  responseType
) => {
  const url = getBaseUrl(serviceType);
  const resolvedResponseType =
    typeof responseType === "string" ? responseType : responseType?.responseType;
  return instance.get(url + path, { params, headers, responseType: resolvedResponseType });
};

export const deleteApi = (path, serviceType) => {
  const url = getBaseUrl(serviceType);
  return instance.delete(url + path);
};

export const postApi = (path, body, headers = {}, params = {}, serviceType) => {
  const url = getBaseUrl(serviceType);
  return instance.post(url + path, body, { params, headers });
};

export const putApi = (path, body, headers = {}, params = {}, serviceType) => {
  const url = getBaseUrl(serviceType);
  return instance.put(url + path, body, { params, headers });
};

export const entityApi = {
  list(entityName, queryParam = "offset=0&size=1000", payload = {}, serviceType = COMMON_SERVICE) {
    const queryString = queryParam ? `?${queryParam}` : "";
    return postApi(`/entity/v2/${entityName}${queryString}`, payload, {}, {}, serviceType);
  },

  search(entityName, queryParam = "offset=0&size=1000", payload = {}, serviceType = COMMON_SERVICE) {
    const queryString = queryParam ? `?${queryParam}` : "";
    return postApi(`/entity/v2/${entityName}/search${queryString}`, payload, {}, {}, serviceType);
  },

  create(entityName, payload, options = {}) {
    const { headers = {}, params = {}, serviceType = COMMON_SERVICE } = options;
    return putApi(`/entity/${entityName}`, sanitizeEntityPayload(payload), headers, params, serviceType);
  },

  update(entityName, entityId, payload, options = {}) {
    const { headers = {}, params = {}, serviceType = COMMON_SERVICE } = options;
    return putApi(`/entity/${entityName}/${entityId}`, sanitizeEntityPayload(payload), headers, params, serviceType);
  },

  remove(entityName, entityId, serviceType = COMMON_SERVICE) {
    return deleteApi(`/entity/${entityName}/${entityId}`, serviceType);
  },
};
