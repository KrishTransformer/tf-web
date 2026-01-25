import * as constants from "../constants/EntityConstants";

const buildQueryString = (params) => {
  return new URLSearchParams(params).toString();
};

export const fetchEntity = (
  entityName,
  queryParam = {},
  payload,
  overWriteEntityName,
) => {
  const queryString = buildQueryString(queryParam);
  return {
    type: constants.FETCH_ENTITY,
    entityName,
    queryParam: queryString,
    overWriteEntityName,
    payload,
  };
};


export const fetchEntityFullfiled = (response) => {
  return {
    type: constants.FETCH_ENTITY_FULFILLED,
    response: response.data,
    entityName: response.entityName,
  };
};

export const fetchEntityFailed = (entityName) => ({
  type: constants.FETCH_ENTITY_FAILED,
  entityName,
});

export const fetchSearchEntity = (
  entityName,
  queryParam = {},
  payload,
  overWriteEntityName,
) => {
  const queryString = buildQueryString(queryParam);
  return {
    type: constants.FETCH_SEARCH_ENTITY,
    entityName,
    queryParam: queryString,
    overWriteEntityName,
    payload,
  };
};

export const fetchSearchEntityFullfiled = (response) => {
  return {
    type: constants.FETCH_SEARCH_ENTITY_FULFILLED,
    response: response.data,
    entityName: response.entityName,
  };
};

export const fetchSearchEntityFailed = (entityName) => ({
  type: constants.FETCH_SEARCH_ENTITY_FAILED,
  entityName,
});

export const addEntity = (jsonBody, entityName, skipFetch) => ({
  type: constants.ADD_ENTITY,
  jsonBody,
  entityName,
  skipFetch
});

export const addEntityFullfiled = (entityName) => ({
  type: constants.ADD_ENTITY_FULFILLED,
  entityName,
});

export const addEntityFailed = (entityName) => ({
  type: constants.ADD_ENTITY_FAILED,
  entityName,
});

export const deleteEntity = (entityId, entityName,skipFetch) => ({
  type: constants.DELETE_ENTITY,
  entityId,
  entityName,
  skipFetch
});

export const deleteEntityFullfiled = (entityName) => ({
  type: constants.DELETE_ENTITY_FULFILLED,
  entityName,
});

export const deleteEntityFailed = (entityName) => ({
  type: constants.DELETE_ENTITY_FAILED,
  entityName,
});

export const updateEntity = (entityId, jsonBody, entityName, skipFetch) => ({
  type: constants.UPDATE_ENTITY,
  entityId,
  jsonBody,
  entityName,
  skipFetch,
});

export const updateEntityFullfiled = (entityName) => ({
  type: constants.UPDATE_ENTITY_FULFILLED,
  entityName,
});

export const updateEntityFailed = (entityName) => ({
  type: constants.UPDATE_ENTITY_FAILED,
  entityName,
});