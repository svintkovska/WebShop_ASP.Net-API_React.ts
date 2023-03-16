import { ChangeEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../../../http";

interface IForgotPasswordForm{
    userId: string | null ;
    token: string | null;
    newPassword : string;
    confirmPassword : string;

}

const ResetPassword = ()=>{
    const navigator = useNavigate();
    let [searchParams] = useSearchParams();
    const [state, setState] = useState<IForgotPasswordForm>({
        userId: searchParams.get("userId"),
        token: searchParams.get("code"),
        newPassword : "",
        confirmPassword : ""
      });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState<boolean>(false);

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        setState({...state, [e.target.name]: e.target.value});
        console.log("111111", state);
    }

        const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
            e.preventDefault();
            if (state.newPassword !== state.confirmPassword) {
                setErrorMessage("Passwords do not match");
                return;
              }
              setErrorMessage("");
                
            try{
              const result = await http
              .post("api/account/newPassword", state);
              setSuccessMessage(true);
              setTimeout(() => {
                navigator("/account/login");
              }, 2000);
            }
            catch(error: any){
              console.log ("error:", error);
            }
            console.log ("Data sent", state);       
        }
    return (
        <>
          <div className="container col-6 offset-3">
          <h1 className="mt-2 mb-5 text-center">Create New Password</h1>
          {successMessage && (
            <div className="alert alert-success" role="alert">
             Password has been changed           
            </div>
          )}
          {!successMessage && errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
          <form onSubmit={onSubmitHandler}>
        
           
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
                placeholder="Enter new password"
                required
              />
              <div className="invalid-feedback">Please enter a valid name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className={`form-control ${errorMessage ? "is-invalid" : ""}`}
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={onChangeInputHandler}
                placeholder="Confirm password"
                required
              />
              {errorMessage && (
                <div className="invalid-feedback">{errorMessage}</div>
              )}
            </div>
             
           
            <div className="text-center">
              <button type="submit" className="btn btn-success mb-3">
                Change Password
              </button>
            </div>
            
          </form>

        </div>
        </>
    )
}

export default ResetPassword;