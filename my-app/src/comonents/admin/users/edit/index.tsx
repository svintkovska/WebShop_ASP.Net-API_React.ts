import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import http from "../../../../http";
import SuccessMessage from "../../../common/SuccessMessage";
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
    lockoutEndDate:null,
  });
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  useEffect(() => {
    http.get<IEditUser>(`api/users/edit/${userId}`).then((resp) => {
      setUser(resp.data);

    console.log("0000", user)
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
            navigate('/admin/users/list');
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
      <div>
        {successMessage && <SuccessMessage message="Changes saved" />}

        <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
          <h1 className="mt-5 mb-4 text-center text-info">Edit User</h1>

          <form
            onSubmit={handleFormSubmit}
            className="border border-info pb-2 pt-5 ps-5 pe-5 bg-light rounded"
            style={{ width: 700 }}
          >
            <div className="d-flex flex-row justify-content-baseline align-items-center">
              <div className="me-5">
                <div className="mt-1 mb-5">
                  <img
                    src={APP_ENV.IMAGE_PATH + "300_" + user.image}
                    alt="select img"
                    width="170px"
                  />
                </div>
                <div>
                  <label className="me-5 text-info">
                    Roles:
                    {user.allRoles.map((role) => (
                      <label key={role.id} className="me-3 ms-3">
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

              <div className="d-flex flex-column justify-content-baseline align-items-center">
                <div className="mb-1">
                  <label className="text-info">
                    First Name:
                    <input
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      disabled
                      width={"auto"}
                      className="form-control"
                    />
                  </label>
                </div>
                <div className="mb-3">
                  <label className="text-info">
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
                  <label className="text-info">
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
                <div className="mb-0">
                  <label className="text-info">
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      disabled
                      style={{ minWidth: 200 }}
                      className="form-control"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-info">
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
                <label className="text-info">
                  Lockout End Date:
                  <input
                    style={{ marginRight: "10px", marginLeft: "10px" }}
                    type="date"
                    name="lockoutEndDate"
                    value={
                      user.lockoutEndDate
                      ? new Date(user.lockoutEndDate).toISOString().split('T')[0]     
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            )}
            <div className="text-center mt-5">
              <button type="submit" className="btn btn-outline-info">
                Save
              </button>
            </div>
          </form>
          <Link to="/admin/users/list">
                <button className="btn btn-info mt-5">Go Back to Users</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default EditUserPage;
