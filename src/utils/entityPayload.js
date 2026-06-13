const ENTITY_OWNERSHIP_KEYS = new Set([
  "ownerId",
  "tenantUrl",
  "tenantURL",
  "tenentURL",
  "tenantDatabase",
]);

const isPlainObject = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const isBlob = typeof Blob !== "undefined" && value instanceof Blob;
  const isFile = typeof File !== "undefined" && value instanceof File;
  const isFormData = typeof FormData !== "undefined" && value instanceof FormData;

  if (value instanceof Date || isBlob || isFile || isFormData) {
    return false;
  }

  return Object.getPrototypeOf(value) === Object.prototype;
};

export const sanitizeEntityPayload = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeEntityPayload(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.entries(value).reduce((accumulator, [key, fieldValue]) => {
    if (!ENTITY_OWNERSHIP_KEYS.has(key)) {
      accumulator[key] = sanitizeEntityPayload(fieldValue);
    }

    return accumulator;
  }, {});
};

export const blockedEntityOwnershipKeys = Array.from(ENTITY_OWNERSHIP_KEYS);
