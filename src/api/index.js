import axios from "axios";
import CustomCookies from "./Cookies";
import { clearAuthTokens, getIdToken } from "./authToken";
import { COMMON_SERVICE } from "../constants/CommonConstants";
import { sanitizeEntityPayload } from "../utils/entityPayload";

const instance = axios.create({
  withCredentials: false,
});

instance.interceptors.request.use(async (config) => {
  if (!config.headers) {
    config.headers = {};
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
  function (error) {
    const authorizationHeader =
      error?.config?.headers?.Authorization || error?.config?.headers?.authorization || "";
    const isBearerRequest =
      typeof authorizationHeader === "string" && authorizationHeader.startsWith("Bearer ");

    if (error.response && [401, 403].includes(error.response.status) && isBearerRequest) {
      clearAuthTokens();
      CustomCookies.setAuthRedirectMessage("Session expired. Please log in again.");
      redirectToLogin();
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
    API_URL: "http://localhost:8080/tf/api",
  },
};

export const coreService = {
  prod: {
    API_URL: "https://tf-core-service.trafointel.com/tf/api/" + fullUrl,
  },
  local: {
    API_URL: "http://localhost:8080/tf/api",
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


export const storageService = {
  prod: {
    API_URL: "https://transformer.treffertech.com",
  },
  local: {
    API_URL: "https://transformer.treffertech.com",
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
export const storageServiceConfig = getEnvironment(storageService);

const BASE_URL = {
  CORE_SERVICE: coreServiceConfig.API_URL,
  COMMON_SERVICE: commonServiceConfig.API_URL,
  CAD_SERVICE: cadServiceConfig.API_URL,
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
