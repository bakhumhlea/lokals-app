import TYPES from '../actions/types';

const INITIAL_STATE = {
  currentPath: {},
  theme: null,
  local: {
    city: 'san francisco'
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_CURRENT_PATH:
      return {
        ...state,
        currentPath: action.payload
      };
    case TYPES.SET_APP_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case TYPES.SET_LOCAL:
      return {
        ...state,
        local: action.payload
      }
    default:
      return state;
  }
};