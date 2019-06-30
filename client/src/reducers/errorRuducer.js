import TYPES from '../actions/types';
// import isEmpty from '../util/is-empty'

const INITIAL_STATE = {
  types: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_ERRORS:
      return {
        types: action.payload
      }
    default:
      return state;
  }
}