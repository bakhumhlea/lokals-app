import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const INITIAL_STATE = {};
const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__? 
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  :
  compose(
    applyMiddleware(...middleware)
  );

const store = createStore(
  rootReducer, 
  INITIAL_STATE, 
  composeEnhancers
);

export default store;
