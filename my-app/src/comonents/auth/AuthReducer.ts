import axios from "axios";
import { AuthActionType, IAuthUser, UserActionType } from "./types";

const initState: IAuthUser = {
    isAuth: localStorage.getItem('token') ? true: false,
    email: localStorage.getItem('email') as string,
    imagePath: localStorage.getItem('imagePath') as string,
    token: localStorage.getItem('token') as string    
};

export const AuthReducer = (state = initState, action: any)=>{

    axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;

   switch(action.type){
    case AuthActionType.USER_LOGIN: {
        return {
            ...state,
            isAuth: true
        }
    }
    case AuthActionType.USER_LOGOUT: {
        return {
            ...state,
            isAuth: false
        }
    }
    case UserActionType.SET_EMAIL: {
        return {
          ...state,
          email: action.payload,
        };
      }
      case UserActionType.SET_IMAGE: {
        return {
          ...state,
          image: action.payload,
        };
      }
   }
    return state;
}

export const setEmail = (email: string) => ({
    type: UserActionType.SET_EMAIL,
    payload: email,
  });
  
  export const setImage = (image: string) => ({
    type: UserActionType.SET_IMAGE,
    payload: image,
  });