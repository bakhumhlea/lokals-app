import TYPES from '../actions/types';
import isEmpty from '../util/is-empty'

const INITIAL_STATE = {
  isAuth: false,
  isAdmin: false,
  user: {},
  errors: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.EMAIL_SIGN_IN:
      return {
        ...state,
        user: action.payload
      };
    case TYPES.GOOGLE_SIGN_IN:
      return {
        ...state,
        user: action.payload
      };
    case TYPES.FACEBOOK_SIGN_IN:
      return {
        ...state,
        user: action.payload
      }
    case TYPES.SET_CURRENT_USER:
      return {
        ...state,
        isAuth: !isEmpty(action.payload),
        isAdmin: action.payload.isAdmin,
        user: action.payload.user
      };
    case TYPES.LOG_OUT:
      return {
        ...state,
        isAuth: !isEmpty(action.payload),
        isAdmin: false,
        user: action.payload,
      };
    default:
      return state;
  }
};