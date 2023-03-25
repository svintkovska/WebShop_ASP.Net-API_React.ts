import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http";
import { setEmail, setImage, setRoles } from "../AuthReducer";
import SendEmailModal from "../resetPassword/sendEmailModal";
import { AuthActionType, IAuthUser } from "../types";
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
    const [errorBlock, setErrorBlock] = useState<string>("");
    const { roles } = useSelector((store: any) => store.auth as IAuthUser);
    const isAdmin = roles.includes('admin');

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

        const roles: string[] = resp.data.roles;
        localStorage.setItem('roles', JSON.stringify(roles));

        http.defaults.headers.common["Authorization"] = `Bearer ${result}`;
 
        dispatch({ type: AuthActionType.USER_LOGIN });
        dispatch(setEmail(state.email));
        dispatch(setImage(resp.data.user.image));
        dispatch(setRoles(roles));

        if(isAdmin){
          navigator("/admin")
        }
        else{
          navigator("/");

        }
      }catch (error: any) {
        console.log("error:", error.response.data);
        setErrorBlock(error.response.data);

      }



      console.log("Data sent", state);
    };
    const handleGoogleAuthError = (error: string) =>{
      setErrorBlock(error);

    } 
return(
    <>
   <div className="d-flex flex-column justify-content-baseline align-items-center vh-100"
  style={{
    backgroundImage: "url(https://img.freepik.com/premium-photo/black-friday-sale-banner-concept-design-shopping-bag-black-background-with-copy-space-3d-render_46250-3239.jpg)",
    backgroundSize: "cover",

  }}>
       
    {errorBlock && (
          <div className="mt-3 text-center text-danger">
            <h5>{errorBlock}</h5>
          </div>
        )}
          <h1 className="mt-2 mb-3 text-center text-info">Log In</h1>

          <form onSubmit={onSubmitHandler} className="border border-info pb-2 pt-5 ps-5 pe-5"
          style={{width: 500, height: 400}}>
        
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-info">
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
              <label htmlFor="password" className="form-label text-info">
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
              <button type="button" className="btn btn-link text-info" onClick={onClickHandler} >
                Forgot password?
              </button>
              {showModal && <SendEmailModal showModal={showModal} handleModal={handleModal} />}
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-info mb-1">
                Log In
              </button>
            </div>
            <hr></hr>
            <div className="text-center">
              <div className="col-md-12">
                <GoogleAuth onError={handleGoogleAuthError}></GoogleAuth>

              </div>
            </div>
          </form>
          <p className="text-center mt-5 text-info">Not a member? 
          <Link to="/account/register">
                <button className="btn btn-outline-info " style={{marginLeft: 10}}>Register</button>
          </Link>
          </p>
        </div>
    </>
)

}



export default LoginPage;