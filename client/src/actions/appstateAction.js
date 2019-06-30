import TYPES from "./types";
// import Axios from "axios";
// import isEmpty from '../util/is-empty';

export const setCurrentPath = (path) => {
  return {
    type: TYPES.SET_CURRENT_PATH,
    payload: path
  }
};
export const setAppTheme = (theme) => {
  return {
    type: TYPES.SET_APP_THEME,
    payload: theme
  }
}
export const setLocal = (local) => {
  return {
    type: TYPES.SET_LOCAL,
    payload: local
  }
}