import TYPES from '../actions/types';
// import isEmpty from '../util/is-empty'

const INITIAL_STATE = {
  profile: {},
  isAdmin: false,
  recentKw: [],
  pref: ['Thai', 'Japanese', 'Wine', 'Italian', 'Coffee', 'Salad']
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
    case TYPES.SAVE_RECENT_KEYWORD:
      return {
        ...state,
        recentKw: [action.payload, ...state.recentKw]
      }
    default:
      return state;
  }
};