import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http";
import { setEmail, setImage } from "../AuthReducer";
import SendEmailModal from "../resetPassword/sendEmailModal";
import { AuthActionType } from "../types";
import GoogleAuth from "./google";
import { LoginForm } from "./types";



const LoginPage = () =>{

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = useState<LoginForm>({
      email: "",
      password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);


    const handleModal = () => {
      setShowModal(!showModal);
    };

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [e.target.name]: e.target.value });
    };

    const onClickHandler = async () => {
      setShowModal(true);
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const resp = await http.post("api/account/login", state);

        const { token } = resp.data;
        const { result } = token;
        localStorage.setItem("token", result);
        localStorage.setItem("email", state.email);
        localStorage.setItem("imagePath", resp.data.user.image);

        http.defaults.headers.common["Authorization"] = `Bearer ${result}`;

        dispatch({ type: AuthActionType.USER_LOGIN });
        dispatch(setEmail(state.email));
        dispatch(setImage(resp.data.user.image));

        navigator("/");
      } catch (error: any) {
        console.log("error:", error);
        setErrorMessage("Inavlid email or password");
      }
      console.log("Data sent", state);
    };
        
return(
    <>
    <div className="container col-6 offset-3">
          <h1 className="mt-2 mb-3 text-center">Log In</h1>

          <form onSubmit={onSubmitHandler}>
        
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={state.email}
                onChange={onChangeInputHandler}
                placeholder="Enter Email"
                required
              />
              <div className="invalid-feedback">Please enter a valid name.</div>
            </div>

            <div className="mb-1">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${errorMessage ? "is-invalid" : ""}`}
                name="password"
                value={state.password}
                onChange={onChangeInputHandler}
                placeholder="Enter password"
                required
              />
               {errorMessage && (
                <div className="invalid-feedback">{errorMessage}</div>
              )}
            </div>
             
            <div className="text-center mb-3">
              <button type="button" className="btn btn-link" onClick={onClickHandler} >
                Forgot password?
              </button>
              {showModal && <SendEmailModal showModal={showModal} handleModal={handleModal} />}
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-success mb-3">
                Log In
              </button>
            </div>
            <hr></hr>
            <div className="text-center">
              <div className="col-md-12">
                <GoogleAuth></GoogleAuth>

              </div>
            </div>
          </form>
          <p className="text-center">Not a member? 
          <Link to="/account/register">
                <button className="btn btn-outline-success" style={{marginLeft: 10}}>Register</button>
          </Link>
          </p>
        </div>
    </>
)

}



export default LoginPage;