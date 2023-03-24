import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../../../http";
import SuccessMessage from "../../../common/SuccessMessage";
import { IAuthUser } from "../../types";


interface IChangePassword {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    }


const ChangePassword = () =>{
    const {email} = useSelector((store: any) => store.auth as IAuthUser);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<boolean>(false);

    const [state, setState] = useState<IChangePassword>({
      email: email,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });



    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        setState({...state, [e.target.name]: e.target.value});
    }


    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log(state);

        if (state.newPassword !== state.confirmPassword) {
          setErrorMessage("New Password and Confirm Password do not match");
          return;
        }
        if (state.newPassword.length < 6) {
          setErrorMessage("New Password should be at least 6 characters long");
          return;
        }
        try{
          const result = await http
          .post(`api/Account/edit/changePassword`, state)
          .then(resp => {
            setSuccessMessage(true);
          })
        }
        catch(error: any){
          console.log ("error:", error);
          setErrorMessage("Incorrect Password");
        }
        console.log ("Data sent", state);     
    }

    return (
        <>
        <div className="container col-6 offset-3">
          <h1 className="mt-5 mb-4 text-center">Change Password</h1>
          {successMessage && (
        <SuccessMessage message="Password successfully changed" />
      )}
          {!successMessage && errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">
                Old Password
              </label>
              <input
                type="password"
                className="form-control"
                name="oldPassword"
                value={state.oldPassword}
                onChange={onChangeInputHandler}
                placeholder="Enter Old Password"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={state.newPassword}
                onChange={onChangeInputHandler}
                placeholder="Enter New Password"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={onChangeInputHandler}
                placeholder="Confirm Password"
                required
              />
            </div>
           
            <div className="text-center">
              <button type="submit" className="btn btn-success">
              Change Password
              </button>
            </div>
          </form>
          <Link to="/account/editProfile">
                <button className="btn btn-outline-success">Go Back To Profile</button>
          </Link>
        </div>
      </>

    );

}


export default ChangePassword;