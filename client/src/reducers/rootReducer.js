import { combineReducers } from 'redux';

import userReducer from './userReducer';
import errorReducer from './errorReducer';
import jobReducer from './jobReducer';
import loaderReducer from './loaderReducer';

const rootReducer = combineReducers({
  user: userReducer,
  error: errorReducer,
  job: jobReducer,
  loader: loaderReducer
});

export default rootReducer;
