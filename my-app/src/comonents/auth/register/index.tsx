import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import selectUser from "../../../assets/selectUser.png"


interface RegisterForm {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    uploadImage: File | null;
  }
  

const RegisterPage = () =>{
    const navigator = useNavigate();

    const [state, setState] = useState<RegisterForm>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        uploadImage: null,
      });

      const [errorMessage, setErrorMessage] = useState("");

     
      const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        setState({...state, [e.target.name]: e.target.value});



    }

    const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const {target} = e;
      const {files} = target;

      console.log ("Show data", files);
      if(files){
        const file = files[0];
        setState({...state, uploadImage: file});
      }
      target.value = "";
    }


    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if (state.password !== state.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
          }
          setErrorMessage("");

        try{
          const result = await axios
          .post("http://localhost:5285/api/account/register", state, {
            headers: {"Content-Type": "multipart/form-data"}
          });
          navigator("/");
        }
        catch(error: any){
          console.log ("error:", error);
        }
        console.log ("Data sent", state);

        
    }

    return (
      <>
        <div className="container col-6 offset-3">
          <h1 className="mt-2 mb-3 text-center">Create New Account</h1>

          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={state.firstName}
                onChange={onChangeInputHandler}
                placeholder="Enter First Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={state.lastName}
                onChange={onChangeInputHandler}
                placeholder="Enter Last Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid name.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                User Name
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={state.username}
                onChange={onChangeInputHandler}
                placeholder="Enter User Name"
                required
              />
              <div className="invalid-feedback">Please enter a valid name.</div>
            </div>

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
                className="form-control"
                name="password"
                value={state.password}
                onChange={onChangeInputHandler}
                placeholder="Enter password"
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

            <div className="mb-3">
              <label htmlFor="uploadImage" className="form-label">
                <img
                  src={
                    state.uploadImage == null
                      ? selectUser
                      : URL.createObjectURL(state.uploadImage)
                  }
                  alt="select img"
                  width="150px"
                  style={{ cursor: "pointer" }}
                />
              </label>
              <input
                type="file"
                className="d-none"
                name="uploadImage"
                id="uploadImage"
                onChange={onFileChangeHandler}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success mb-3">
                Register
              </button>
            </div>
            <hr></hr>
            <div className="text-center">
              <div className="col-md-12">
                <a
                  className="btn btn-outline-primary text-uppercase mb-4"
                  href="#"
                >
                  <img src="https://img.icons8.com/color/16/000000/google-logo.png" />{" "}
                  Register with Google
                </a>
              </div>
            </div>
          </form>
          <p className="text-center">Have an account? 
          <Link to="/account/login">
                <button className="btn btn-outline-success" style={{marginLeft: 10}}>Log In</button>
          </Link>
          </p>
        </div>
      </>
    );
}

export default RegisterPage;