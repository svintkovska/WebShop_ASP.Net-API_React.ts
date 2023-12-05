

 export interface IUser{
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    image: string;
    userRoles: string[];
    isLockedOut: boolean;
}

export interface ISelectRole{
    id: number;
    name: string;
    IsSelected: boolean;
  }
export interface IEditUser{

    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    image: string;
    isLockedOut: boolean;
    allRoles: ISelectRole[];
    selectedRoles: number[];
    lockoutEndDate: Date | null 
}

export interface IUserResult{
  users: Array<IUser>,
  pages: number,
  currentPage: number,
  total: number,

}
export interface IUserSearch{
  email?: string,
  dateCreated?: string,
  page?: number | string | null
}