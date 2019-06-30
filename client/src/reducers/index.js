import { combineReducers } from 'redux';
import authReducer from './authReducer';
import searchReducer from './searchReducer';
import businessReducer from './businessReducer';
import profileReducer from './profileReducer';
import errorReducer from './errorRuducer';
import appstateReducer from './appstateReducer';

export default combineReducers({
  auth: authReducer,
  user: profileReducer,
  search: searchReducer,
  business: businessReducer,
  error: errorReducer,
  app: appstateReducer
});
