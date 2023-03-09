import { AuthActionType, IAuthUser } from "./types";

const initState: IAuthUser = {
    isAuth: localStorage.getItem('token') ? true: false,
    username: ""
};

export const AuthReducer = (state = initState, action: any)=>{
    
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
   }
    return state;
}

