import React, { ChangeEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import http from '../../../../http';


interface RegisterForm {
    token: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    uploadImage: File | null;
    imagePath: string
  }
  

const ContinueRegistration = () =>{
    const navigator = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const googleTokenValue = queryParams.get('googleToken');
    const token = googleTokenValue !== null ? googleTokenValue : '';    
    const email = queryParams.get('email');
    const firstName = queryParams.get('firstName');
    const lastName = queryParams.get('lastName');
    const imagePath = queryParams.get('imagePath');



    const [state, setState] = useState<RegisterForm>({
      token: token,
      firstName: firstName || '',
      lastName: lastName || '',
      username: email || '',
      email: email || '',
      uploadImage: null,
      imagePath: imagePath || ''
      });
     
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
        
        try{
          const result = await http
          .post("api/account/google/registartion", state, {
            headers: {"Content-Type": "multipart/form-data"}
          });
          navigator("/account/login");
        }
        catch(error: any){
          console.log ("error:", error);
        }
        console.log ("Data sent", state);      
    }

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
          <h1 className="mt-2 mb-3 text-center text-info">Finish Registration</h1>

          <form
            onSubmit={onSubmitHandler}
            className="border border-info pb-2 pt-5 ps-5 pe-5"
            style={{ width: 550, height: "auto" }}
          >
            <div className="d-flex flex-row justify-content-baseline align-items-center">
              <div className="mb-3 me-5 text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>

              <div className="mb-3 text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>
            </div>

            <div className="d-flex flex-row justify-content-baseline align-items-center">
              <div className="mb-3 me-5 text-info">
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
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>

              <div className="mb-3 text-info">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={state.email}
                  placeholder="Enter Email"
                  disabled={true}
                />
                <div className="invalid-feedback">
                  Please enter a valid name.
                </div>
              </div>
            </div>

            <div className="mt-1">
              <label htmlFor="uploadImage" className="form-label">
                <img
                  src={
                    state.uploadImage == null
                      ? "http://localhost:5285/images/" +
                        "300_" +
                        state.imagePath
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
                Finish
              </button>
            </div>
            <hr></hr>
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

export default ContinueRegistration;