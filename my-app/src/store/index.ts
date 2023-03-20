import { AuthReducer } from './../comonents/auth/AuthReducer';
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import axios from 'axios';
import { BasketReducer } from '../comonents/shop/BasketReducer';

export const rootReducer = combineReducers({
    auth: AuthReducer,
    basket: BasketReducer
});

export const store = createStore(rootReducer,
    composeWithDevTools(applyMiddleware(thunk)));