import axios from "axios";
import CustomCookies from "./Cookies";

const instance = axios.create({
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  let accessToken = CustomCookies.getAccessToken();
  if (!config?.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      CustomCookies.clearTokens();
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

const protocol = "https://";
const fullUrl = window.location.host;
const urlParts = fullUrl.split(".");
let subDomain = urlParts[0];


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
    API_URL: "https://tf-core-service.trafointel.com/tf/api/design.trafointel.com",
    // API_URL: "http://localhost:8080/tf/api/design.trafointel.com",
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

export const getApi = (
  path,
  serviceType,
  params = {},
  headers = { Accept: "application/json", "Content-Type": "application/json" },
  responseType
) => {
  console.log(responseType)
  const url = serviceType ? BASE_URL[serviceType] : BASE_URL.CORE_SERVICE;
  return instance.get(url + path, { params, headers, responseType: 'blob' });
};

export const deleteApi = (path, serviceType) => {
  const url = serviceType ? BASE_URL[serviceType] : BASE_URL.CORE_SERVICE;
  return instance.delete(url + path);
};

export const postApi = (path, body, headers = {}, params = {}, serviceType) => {
  const url = serviceType ? BASE_URL[serviceType] : BASE_URL.CORE_SERVICE;
  //console.log("SERVICE TYPE:", serviceType);
  console.log("full_url", url+path);
  console.log("path:", path);
  console.log("params:",params)
  return instance.post(url + path, body, { params, headers });
};

export const putApi = (path, body, headers = {}, params = {}, serviceType) => {
  const url = serviceType ? BASE_URL[serviceType] : BASE_URL.CORE_SERVICE;
  return instance.put(url + path, body, { params, headers });
};
