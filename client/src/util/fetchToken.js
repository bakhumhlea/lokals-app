import jwt_decode from 'jwt-decode'
import setAuthToken from "./setAuthToken";
import store from "../store/store";
import { setCurrentUser } from "../actions/authActions";

export const fetchToken = () => {
  const token = localStorage.getItem('jwtToken');
  
  if (token) {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    setAuthToken(token);
    localStorage.setItem('jwtToken', token);
    store.dispatch(setCurrentUser(decoded));

    if (decoded.exp < currentTime) {
      store.dispatch(setCurrentUser({}));
      localStorage.removeItem('jwtToken');
      setAuthToken();
    }
  }
}