import TYPES from "./types";
import Axios from "axios";
// import isEmpty from '../util/is-empty';

export const setSearchResults = (keywords, zoomindex) => dispatch => {
  Axios
    .get(`/api/business/search/category/${keywords}`)
    .then(res => {
      dispatch(setMapCenter(res.data[0].location));
      dispatch(setZoom(zoomindex));
      dispatch(setResults(res.data));
    })
    .catch(err => console.log(err));
};

export const setResults = (results) => {
  return {
    type: TYPES.SET_RESULTS,
    payload: results
  };
}

export const setMapCenter = (position) => {
  return {
    type: TYPES.SET_CENTER,
    payload: position
  };
}

export const setZoom = (zoomindex) => {
  return {
    type: TYPES.SET_ZOOM,
    payload: zoomindex
  }
}