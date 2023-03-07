import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "./google";

interface LoginForm {
    email: string;
    password: string;
  }
  

const LoginPage = () =>{

    const navigator = useNavigate();

    const [state, setState] = useState<LoginForm>({
        email: "",
        password: "",
      });

      const [errorMessage, setErrorMessage] = useState("");

     
      const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        setState({...state, [e.target.name]: e.target.value});}

        const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
            e.preventDefault();
            
            try{
              const result = await axios
              .post("http://localhost:5285/api/account/login", state);
              navigator("/");
            }
            catch(error: any){
              console.log ("error:", error);
              console.log ("----------");

              setErrorMessage("Invalid password or email");
            }
            console.log ("Data sent", state);          
        }
        
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

            <div className="mb-3">
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