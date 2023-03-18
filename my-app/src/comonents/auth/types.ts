export interface IAuthUser{
    email: string,
    imagePath: string,
    isAuth: boolean,
    token: string,
    roles: string[]
}

export enum AuthActionType {
    USER_LOGIN = "USER_LOGIN_ACTION",
    USER_LOGOUT = "USER_LOGOUT_ACTION",

}

export enum UserActionType {
    SET_EMAIL = "SET_EMAIL_ACTION",
    SET_IMAGE = "SET_IMAGE_ACTION",
    SET_ROLES = "SET_ROLES_ACTION",

  }




