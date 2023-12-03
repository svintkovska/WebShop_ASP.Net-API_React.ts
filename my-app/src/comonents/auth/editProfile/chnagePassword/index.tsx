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
        <div className="cart-card text-center " style={{width: "600px"}}>
          <div className=" cart" style={{ borderRadius: "1rem" }}>
            <div className="title">
            <h4>
                  <b>Change Password</b>
                </h4>
          {successMessage && (
        <SuccessMessage message="Password successfully changed" />
      )}
          {!successMessage && errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
          <form onSubmit={onSubmitHandler} className=" pb-2 pt-5 ps-5 pe-5"
            style={{ width: 500 }}>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label" style={{color: "#e8baba"}}>
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
              <label htmlFor="newPassword" className="form-label" style={{color: "#e8baba"}}>
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
              <label htmlFor="confirmPassword" className="form-label " style={{color: "#e8baba"}}>
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
           
            <div className="text-center mb-3">
              <button type="submit" className="cart-btn" style={{width: "300px"}}>
              Change Password
              </button>
            </div>
          </form>
          <Link to="/account/editProfile">
                <button className="back-btn" style={{padding: "10px", width: "200px"}}>Go Back To Profile</button>
          </Link>
        </div>
        </div>
        </div>
      </>

    );

}


export default ChangePassword;