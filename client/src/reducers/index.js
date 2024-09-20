import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import userReducers from "./userReducer";
import fileReducers from "./fileReducer";
import uploadReducer from "./uploadReducer";
import appReducer from "./appReducer";
import {thunk} from 'redux-thunk';

const rootReducer = combineReducers({
  user: userReducers,
  files: fileReducers,
  upload: uploadReducer,
  app: appReducer
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
