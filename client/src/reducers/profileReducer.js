import TYPES from '../actions/types';
// import isEmpty from '../util/is-empty'

const INITIAL_STATE = {
  profile: {},
  isAdmin: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_USER_PROFILE:
      return {
        ...state,
        profile: action.payload
      };
    case TYPES.CLEAR_USER_PROFILE:
      return {
        ...state,
        profile: action.payload
      };
    case TYPES.SET_ADMIN_STATUS:
      return {
        ...state,
        isAdmin: action.payload
      };
    default:
      return state;
  }
};