import React, { ChangeEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import http from '../../../../http';
import imgCosmetics from "../../../../assets/images/cosmetics.jpg"
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation();
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
        <div className="cart-card">
          <div className="row">
            <div className="col-md-8 cart">
              <div className="title">
                <div className="row">
                  <div className="col">
                    <h1 className="mt-2 mb-3 text-center"  style={{color: "#e8baba"}}>
                    {t('auth.finishRegistration')} 
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
                            disabled={true}
                          />
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
   

    

      //       <div className="text-center">
      //         <button type="submit" className="btn btn-info mb-3">
      //           Finish
      //         </button>
      //       </div>
      //       <hr></hr>
      //     </form>
      //     <p className="text-center text-info mt-3">
      //       Have an account?
      //       <Link to="/account/login">
      //         <button
      //           className="btn btn-outline-info"
      //           style={{ marginLeft: 10 }}
      //         >
      //           Log In
      //         </button>
      //       </Link>
      //     </p>
      //   </div>
      //   </div>
      //   </div>
      //   </div>
      //   </div>
      //   </div>
      // </>
    );
}

export default ContinueRegistration;