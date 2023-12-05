import { ChangeEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import {  IUser, IUserResult, IUserSearch } from "../types";
import classNames from "classnames";
import qs from "qs";



const UsersList = ()=>{
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [data, setData] = useState<IUserResult>({
        pages: 0,
        users: [],
        total: 0,
        currentPage:0,
    });
  
    const [search, setSearch] = useState<IUserSearch>({
        email: searchParams.get("email") || "",
        page: searchParams.get("page") || 1,
    });
  
    function filterNonNull(obj: IUserSearch) {
        return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
      }
  
      const buttons = [];
      for (let i = 1; i <= data.pages; i++) {
        buttons.push(i);
      }
  
      const pagination = buttons.map((page) => (
        <li key={page} className="page-item">
          <Link
            className={classNames("page-link", { active: data.currentPage === page })}
            onClick={() => setSearch({ ...search, page })}
            to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
          >
            {page}
          </Link>
        </li>
      ));
  
      const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
        setSearch({...search, [e.target.name]: e.target.value});
    }

    useEffect(() => {
      console.log("search", search);
      http.
          get<IUserResult>("api/Users/search", {
              params: search
          })
          .then((resp) => {
              console.log("categories list", resp.data);
              setData(resp.data);
              setUsers(resp.data.users);
          });
      }, [search]);

//     useEffect(() => {
//       http.
//           get<Array<IUser>>("api/Users")
//           .then((resp) => {
//             setUsers(resp.data);
//           });
//       }, []);
// console.log("users", users);


      const content = users.map((user) => (
        <tr key={user.id}>
          <th scope="row">{user.id}</th>
          <td>
            <img
              src={APP_ENV.IMAGE_PATH + "100_" + user.image}
              width="50"
            ></img>
          </td>
          <td>
            {user.firstName} {user.lastName}
          </td>
          <td>{user.email}</td>
          <td>{user.userName}</td>
          <td>
            {user.userRoles.map((role) => (
              <span key={role}>
                {role}
                <br />
              </span>
            ))}
          </td>
          <td>
            <input
              type={"checkbox"}
              checked={user.isLockedOut}
              disabled
            ></input>
          </td>

          <td>
            <Link to={`/admin/users/edit/${user.id}`}>
              <button className="btn" type="button" style={{ marginTop: 10 }}>
                <img
                  src={"https://cdn-icons-png.flaticon.com/512/143/143437.png"}
                  width="40"
                />
              </button>
            </Link>
          </td>
        </tr>
      ));

    return (
      <>
        <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
          <h1 className="text-center mt-3 mb-4 text-info">Users</h1>
          <div className="d-flex flex-row justify-content-center ">
            <div className="mb-3 col-12 me-5">
              <label htmlFor="name" className="form-label d-none">
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={search.email}
                onChange={onChangeInputHandler}
                placeholder="Search by email"
              />
            </div>
      
            </div>
          <div className="container col-8">
            <table className="table table-striped table-dark">
              <thead className="table-light">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">User Name</th>
                  <th scope="col">Roles</th>
                  <th scope="col">Is Locked Out</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>{content}</tbody>
            </table>
          </div>
          <div className="d-flex flex-row justify-content-center">
              <nav>
                <ul className="pagination">{pagination}</ul>
              </nav>
            </div>
        </div>
      </>
    );
}

export default UsersList;