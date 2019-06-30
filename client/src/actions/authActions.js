import TYPES from "./types";
import Axios from "axios";
import setAuthToken from '../util/setAuthToken';
import jwt_decode from 'jwt-decode';
import isEmpty from '../util/is-empty';
import { clearProfile, setProfile } from "./profileActions";

export const emailSignUp = (userdata) => dispatch => {
  Axios.post(`api/users/signup`, userdata)
    .then(res => {
      const { email } = res.data.user;
      const cred = {
        email: email,
        password: userdata.password
      };
      return dispatch(emailLogin(cred));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    })
}
export const emailLogin = (credential,history,path) => dispatch => {
  Axios.post(`api/users/signin`, credential)
    .then(res => {
      const { token } = res.data;
      console.log(token);
      const decoded = jwt_decode(token);
      setToken(token);
      return dispatch(setCurrentUser(decoded,history,path));
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: TYPES.SET_ERRORS,
        payload: err.response.data
      });
    })
}
export const googleAuth = (tokenId,history,path) => dispatch => {
  Axios.post(`api/users/auth/google/${tokenId}`)
    .then(res => {
      const { token } = res.data;
      console.log(token);
      const decoded = jwt_decode(token);
      setToken(token);
      return dispatch(setCurrentUser(decoded,history,path));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    });
};

export const facebookAuth = (userdata,history,path) => dispatch => {
  Axios.post(`api/users/auth/facebook/`, userdata)
    .then(res => {
      const { token } = res.data;
      const decoded = jwt_decode(token);
      setToken(token);
      return dispatch(setCurrentUser(decoded,history,path));
    })
    .catch(err => {
      return {
        type: TYPES.GET_ERRORS,
        payload: err.response.data
      }
    });
};

export const setCurrentUser = (userdata,history,path) => dispatch => {
  if (!isEmpty(userdata)) {
    Axios
    .get(`/api/profile/uid/${userdata.id}/is-admin`)
    .then(res => {
      dispatch(setProfile());
      dispatch({
        type: TYPES.SET_CURRENT_USER,
        payload: { 
          user: userdata,
          isAdmin: res.data
        }
      });
      if (history && path) {
        history.push(path);
      }
    });
  } else {
    return {
      type: TYPES.SET_CURRENT_USER,
      payload: {}
    };
  }
}
export const logoutUser = () => dispatch => {
  setToken();
  dispatch(clearProfile())
  dispatch({
    type: TYPES.LOG_OUT,
    payload: null
  });
}
const setToken = (token) => {
  if (token) {
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
  } else {
    localStorage.removeItem('jwtToken');
    setAuthToken();
  }
}