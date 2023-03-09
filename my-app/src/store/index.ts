import { AuthReducer } from './../comonents/auth/AuthReducer';
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import axios from 'axios';

export const rootReducer = combineReducers({
    auth: AuthReducer
});

export const store = createStore(rootReducer,
    composeWithDevTools(applyMiddleware(thunk)));