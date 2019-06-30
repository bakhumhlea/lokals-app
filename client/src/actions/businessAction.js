import TYPES from "./types";
import Axios from "axios";
// import isEmpty from '../util/is-empty';

export const goToEditBusinessProfile = (businessdata, history) => {
  history.push('/claimyourbusiness/edit-profile');
  return {
    type: TYPES.GET_BUSINESS_PROFILE,
    payload: businessdata
  }
};
export const goToBizDashboard = (businessdata, history) => {
  history.push('/lokalsbiz/dashboard');
  return {
    type: TYPES.SET_BUSINESS_PROFILE,
    payload: businessdata
  }
}
export const updateBusinessProfile = (businessdata) => dispatch => {
  Axios.post(`/api/business/profile/id/${businessdata._id}`, businessdata)
    .then(res => {
      dispatch({
        type: TYPES.SET_BUSINESS_PROFILE,
        payload: res.data
      })
    })
    .catch(err => console.log(err.response.data));
}