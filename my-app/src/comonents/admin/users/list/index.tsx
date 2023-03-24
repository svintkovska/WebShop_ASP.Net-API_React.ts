import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import {  IUser } from "../types";



const UsersList = ()=>{
    const [users, setUsers] = useState<Array<IUser>>([]);

    useEffect(() => {
      http.
          get<Array<IUser>>("api/Users")
          .then((resp) => {
            setUsers(resp.data);
          });
      }, []);
console.log("users", users);


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

    return(
        <>
        <h1 className="text-center mt-3 mb-4">Users</h1>

        <div className="d-flex justify-content-center mb-4">
          

        <div className="container col-10">
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
        </div>

      </>
    )
}

export default UsersList;