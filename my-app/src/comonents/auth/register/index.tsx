import React, { ChangeEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import selectUser from "../../../assets/selectUser.png"
import http from '../../../http';
import GoogleAuth from '../login/google';
import imgCosmetics from "../../../assets/images/cosmetics.jpg"
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation();
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
            setErrorMessage(t('messages.passwordsDontMatch'));
            return;
          }
          if (state.password.length < 6) {
            setErrorMessage(t('messages.passwordShort'));
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
        <div className="cart-card">
          <div className="row">
            <div className="col-md-8 cart">
              <div className="title">
                <div className="row">
                  <div className="col">
                    <h1 className="mt-2 mb-3 text-center"  style={{color: "#e8baba"}}>
                    {t('auth.createNewAccount')} 
                    </h1>

                    <form
                      onSubmit={onSubmitHandler}
                      className="my_form"
                      style={{ width: 550, height: "auto" }}
                    >
                      <div className="d-flex flex-row justify-content-baseline align-items-center">
                        <div className="mb-3 me-5">
                          <label
                            htmlFor="firstName"
                            className="form-label"
                            style={{color: "#e8baba"}}
                          >
                            {t('auth.firstName')} 
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={state.firstName}
                            onChange={onChangeInputHandler}
                            placeholder={t('auth.enterFirstName')} 
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="lastName"
                            className="form-label"
                            style={{color: "#e8baba"}}
                          >
                            {t('auth.lastName')} 
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={state.lastName}
                            onChange={onChangeInputHandler}
                            placeholder={t('auth.enterLastName')} 
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row justify-content-baseline align-items-center">
                        <div className="mb-3 me-5">
                          <label
                            htmlFor="username"
                            className="form-label "
                            style={{color: "#e8baba"}}
                          >
                            {t('auth.userName')} 
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={state.username}
                            onChange={onChangeInputHandler}
                            placeholder={t('auth.enterUserName')} 
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="email"
                            className="form-label"
                            style={{color: "#e8baba"}}
                          >
                            {t('auth.email')} 
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={state.email}
                            onChange={onChangeInputHandler}
                            placeholder={t('auth.enterEmail')} 
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row justify-content-baseline align-items-center">
                        <div className="mb-3 me-5">
                          <label
                            htmlFor="password"
                            className="form-label"
                            style={{color: "#e8baba"}}
                          >
                            {t('auth.password')} 
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={state.password}
                            onChange={onChangeInputHandler}
                            placeholder={t('auth.enterPassword')} 
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="confirmPassword"
                            className="form-label"
                            style={{color: "#e8baba"}}
                          >
                            {t('auth.confirmPassword')} 
                          </label>
                          <input
                            type="password"
                            className={`form-control ${
                              errorMessage ? "is-invalid" : ""
                            }`}
                            name="confirmPassword"
                            value={state.confirmPassword}
                            onChange={onChangeInputHandler}
                            placeholder={t('auth.confirmPassword')} 
                            required
                          />
                          {errorMessage && (
                            <div className="invalid-feedback">
                              {errorMessage}
                            </div>
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
                            
                            style={{ cursor: "pointer", width:"150px" }}
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
                        <button type="submit" className="cart-btn mb-3" style={{width: "300px"}}>
                        {t('auth.register')} 
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="col-md-12">
                          <GoogleAuth
                            onError={handleGoogleAuthError}
                          ></GoogleAuth>
                        </div>
                      </div>
                    </form>
                    <p className="text-center mt-3" style={{color: "#e8baba"}}>
                    {t('auth.haveAccount')}?
                      <Link to="/account/login">
                        <button
                          className="back-btn" style={{padding: "10px", width: "200px", marginLeft: 10 }}
                        >
                          {t('auth.login')}
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-md-4 summary"
              style={{
                backgroundImage: `url(${imgCosmetics})`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </div>
      </>
    );
}

export default RegisterPage;