import TYPES from '../actions/types';
// import isEmpty from '../util/is-empty'
const SF = {lat: 37.7749, lng: -122.4194};
const INITIAL_STATE = {
  businessResults: [],
  eventResults: [],
  mapCenter: SF,
  zoom: 13
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_RESULTS:
      return {
        ...state,
        businessResults: action.payload,
      };
    case TYPES.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload
      }
    case TYPES.SET_CENTER:
      return {
        ...state,
        mapCenter: action.payload
      };
    default:
      return state;
  }
};