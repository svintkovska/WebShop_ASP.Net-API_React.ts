import React, { ChangeEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import selectUser from "../../../assets/selectUser.png"
import http from '../../../http';
import GoogleAuth from '../login/google';


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
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      uploadImage: null
      });

      const [errorMessage, setErrorMessage] = useState("");
    
      const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        setState({...state, [e.target.name]: e.target.value});

    }

    const onFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const {target} = e;
      const {files} = target;

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
          const result = await http
          .post("api/account/register", state, {
            headers: {"Content-Type": "multipart/form-data"}
          });
          navigator("/account/login");
        }
        catch(error: any){
          console.log ("error:", error);
        }
        console.log ("Data sent", state);       
    }
    const handleGoogleAuthError = (error: string) => {
      setErrorMessage(error);
    };
    
    return (
      <>
        <div
          className="d-flex flex-column justify-content-baseline align-items-center vh-100"
          style={{
            backgroundImage:
              "url(https://img.freepik.com/premium-photo/black-friday-sale-banner-concept-design-shopping-bag-black-background-with-copy-space-3d-render_46250-3239.jpg)",
            backgroundSize: "cover",
          }}
        >
          <h1 className="mt-2 mb-3 text-center text-info">Create New Account</h1>

          <form
            onSubmit={onSubmitHandler}
            className="border border-info pb-2 pt-5 ps-5 pe-5"
            style={{ width: 550, height: "auto" }}
          >
            <div className="d-flex flex-row justify-content-baseline align-items-center">
              <div className="mb-3 me-5">
                <label htmlFor="firstName"  className="form-label text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="lastName" className="form-label text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-baseline align-items-center">
              <div className="mb-3 me-5">
                <label htmlFor="username" className="form-label text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>

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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-baseline align-items-center">
              <div className="mb-3 me-5">
                <label htmlFor="password" className="form-label text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label text-info">
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
            </div>

            <div className="mt-1">
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
              <button type="submit" className="btn btn-info mb-3">
                Register
              </button>
            </div>
            <div className="text-center">
              <div className="col-md-12">
                <GoogleAuth onError={handleGoogleAuthError}></GoogleAuth>
              </div>
            </div>
          </form>
          <p className="text-center text-info mt-3">
            Have an account?
            <Link to="/account/login">
              <button
                className="btn btn-outline-info"
                style={{ marginLeft: 10 }}
              >
                Log In
              </button>
            </Link>
          </p>
        </div>
      </>
    );
}

export default RegisterPage;