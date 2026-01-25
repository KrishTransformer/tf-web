import * as constants from "../constants/EntityConstants";
const initialState = {
  entity: {
    design: {
      isLoading: false,
      isFullfilled: false,
      isAddCompleted: false,
      isFailed: false,
      data: [],
    },
    drawingsStatus: {
      isLoading: false,
      isFullfilled: false,
      isAddCompleted: false,
      isFailed: false,
      data: [],
    },
    lomMaterial: {
      isLoading: false,
      isFullfilled: false,
      isAddCompleted: false,
      isFailed: false,
      data: [],
    },
    users: {
      isLoading: false,
      isFullfilled: false,
      isAddCompleted: false,
      isFailed: false,
      data: [],
    },
  },
};

const entityReducer = (state, action) => {
  const entityState = state ? state : initialState;
  switch (action.type) {
    case constants.FETCH_ENTITY:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: true,
            isFullfilled: false,
            isFailed: false,
          },
        },
      };
    case constants.FETCH_ENTITY_FULFILLED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: true,
            data: action.response,
          },
        },
      };
    case constants.FETCH_ENTITY_FAILED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: false,
            isFailed: true,
          },
        },
      };
    case constants.FETCH_SEARCH_ENTITY:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: true,
            isFullfilled: false,
            isFailed: false
          },
        },
      };
    case constants.FETCH_SEARCH_ENTITY_FULFILLED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: true,
            data: action.response,
          },
        },
      };
    case constants.FETCH_SEARCH_ENTITY_FAILED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: false,
            isFailed: true,
          },
        },
      };
    case constants.ADD_ENTITY:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: true,
            isFullfilled: false,
            isFailed: false,
          },
        },
      };
    case constants.ADD_ENTITY_FULFILLED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: true,
            data: action.payload,
          },
        },
      };
    case constants.ADD_ENTITY_FAILED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: false,
            isFailed: true,
          },
        },
      };
    case constants.DELETE_ENTITY:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: true,
            isFullfilled: false,
            isFailed: false,
          },
        },
      };
    case constants.DELETE_ENTITY_FULFILLED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: true,
            // data: action.payload,
          },
        },
      };
    case constants.DELETE_ENTITY_FAILED:
      return {
        entity: {
          ...entityState.entity,
          [action.entityName]: {
            ...entityState.entity[action.entityName],
            isLoading: false,
            isFullfilled: false,
            isFailed: true,
          },
        },
      };
    default:
      return entityState;
  }
};

export default entityReducer;
