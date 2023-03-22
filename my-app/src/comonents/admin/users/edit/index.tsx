import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import { IEditUser } from "../types";

const EditUserPage = () => {
  const { userId } = useParams();
  let userIdNumber = -1;
  if (userId) {
    userIdNumber = parseInt(userId, 10);
  }
  console.log(userIdNumber);
  const navigate = useNavigate();
  const [user, setUser] = useState<IEditUser>({
    id: userIdNumber,
    firstName: "",
    lastName: " ",
    userName: " ",
    email: " ",
    image: " ",
    isLockedOut: false,
    allRoles: [],
    selectedRoles: [],
    lockoutEndDate: null,
  });
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  useEffect(() => {
    http.get<IEditUser>(`api/users/edit/${userId}`).then((resp) => {
      setUser(resp.data);
    });
  }, []);

  console.log("user", user);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
    try{
        const result = await http
        .put("api/users", user);
        setSuccessMessage(true);
        setTimeout(() => {
            navigate('/users/list');
          }, 1000);
      }
      catch(error: any){
        console.log ("error:", error);
      }
      console.log ("Data sent", user);     
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "isLockedOut") {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "roles") {
      const selectedRoles = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => parseInt(option.value, 10)
      );
      setUser((prevUser) => ({ ...prevUser, [name]: selectedRoles }));
    } else if (name === "lockoutEndDate") {
      setUser((prevUser) => ({ ...prevUser, [name]: new Date(value) }));
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleRoleCheckboxChange = (roleId: number) => {
    setUser((prevUser) => {
      const isRoleSelected = prevUser.selectedRoles.includes(roleId);
      let selectedRoles;

      if (isRoleSelected) {
        selectedRoles = prevUser.selectedRoles.filter((id) => id !== roleId);
      } else {
        selectedRoles = [...prevUser.selectedRoles, roleId];
      }

      return { ...prevUser, selectedRoles };
    });
  };
  return (
    <>
      <div className="container " style={{ marginTop: 60, marginLeft: 350}}>
      {successMessage && (
            <div className="alert alert-success" role="alert">
             Saved            
            </div>
          )}
        <form onSubmit={handleFormSubmit} >
          <div className=" row mb-5" >
            <div className="col-2">
              <div className="mb-5">
                <img
                  src={APP_ENV.IMAGE_PATH + "300_" + user.image}
                  alt="select img"
                  width="170px"
                />
              </div>
              <div>
                <label style={{ marginRight: "10px" }}>
                  Roles:
                  {user.allRoles.map((role) => (
                    <label
                      key={role.id}
                      style={{ marginRight: "10px", marginLeft: "10px" }}
                    >
                      <input
                        type="checkbox"
                        name="selectedRoles"
                        value={role.id}
                        checked={user.selectedRoles.includes(role.id)}
                        onChange={() => handleRoleCheckboxChange(role.id)}
                      />
                      {role.name}
                    </label>
                  ))}
                </label>
              </div>
            </div>

            <div className="col-8">
              <div className="mb-1">
                <label>
                  First Name:
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    disabled
                    className="form-control"
                  />
                </label>
              </div>
              <div className="mb-3">
                <label>
                  Last Name:
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    disabled
                    className="form-control"
                  />
                </label>
              </div>
              <div className="mb-3">
                <label>
                  Username:
                  <input
                    type="text"
                    name="userName"
                    value={user.userName}
                    disabled
                    className="form-control"
                  />
                </label>
              </div>
              <div className="mb-3">
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    disabled
                    className="form-control"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label>
              Locked Out:
              <input
                style={{ marginRight: "10px", marginLeft: "10px" }}
                type="checkbox"
                name="isLockedOut"
                checked={user.isLockedOut}
                onChange={handleInputChange}
              />
            </label>
          </div>

          {user.isLockedOut && (
            <div className="mb-3">
              <label>
                Lockout End Date:
                <input
                  style={{ marginRight: "10px", marginLeft: "10px" }}
                  type="date"
                  name="lockoutEndDate"
                  value={
                    user.lockoutEndDate
                      ? new Date(user.lockoutEndDate).toISOString().substr(0, 10)
                      : ""
                  }
                  onChange={handleInputChange}
                />
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-success">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default EditUserPage;
