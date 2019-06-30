import TYPES from '../actions/types';
// import isEmpty from '../util/is-empty'

const INITIAL_STATE = {
  googleProfile: {},
  profile: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.GET_BUSINESS_PROFILE:
      return {
        googleProfile: action.payload
      };
    case TYPES.SET_BUSINESS_PROFILE:
      return {
        profile: action.payload
      }
    default:
      return state;
  }
};