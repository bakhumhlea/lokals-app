import TYPES from "./types";
import Axios from "axios";
import { saveRecentSearchKeyword } from "./profileActions";
// import isEmpty from '../util/is-empty';

export const getSearchResults = (keyword, location, city) => dispatch => {
  Axios.get(`/api/business/querybusinesses/categories/${keyword}/${location.address}/${location.type}/${city}`)
    .then(res => {
      dispatch(setResults(res.data.businesses));
      dispatch(setSearchQuery({
        currentKw: keyword,
        currentLc: location,
        currentCenter: res.data.map_center
      }));
      dispatch(saveRecentSearchKeyword(keyword));
    })
  .catch(err => { if (err) console.log({error: err.response})});
};

export const getSearchResultsOnly = (keyword, location, city) => dispatch => {
  Axios.get(`/api/business/querybusinesses/categories/${keyword}/${location.address}/${location.type}/${city}`)
    .then(res => {
      dispatch(setResults(res.data.businesses));
    })
  .catch(err => { if (err) console.log({error: err.response})});
}

export const setResults = (results) => {
  return {
    type: TYPES.SET_RESULTS,
    payload: results
  };
}
export const setSearchQuery = (query) => {
  return {
    type: TYPES.SET_QUERY,
    payload: query
  }
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