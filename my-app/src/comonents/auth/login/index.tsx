import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http";
import { setEmail, setImage, setRoles } from "../AuthReducer";
import SendEmailModal from "../resetPassword/sendEmailModal";
import { AuthActionType, IAuthUser } from "../types";
import GoogleAuth from "./google";
import { LoginForm } from "./types";
import imgCosmetics from "../../../assets/images/cosmetics.jpg"
import { useTranslation } from 'react-i18next';


const LoginPage = () =>{
  const { t } = useTranslation();

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = useState<LoginForm>({
      email: "",
      password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
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
        setErrorMessage(error.response.data);
      }


      console.log("Data sent", state);
    };
    const handleGoogleAuthError = (error: string) =>{
      setErrorMessage(error);

    } 
return (
  <>
    <div className="cart-card ">
      <div className="row">
        <div className="col-md-8 cart">
          <div className="title">
            <div className="row">
              <div className="col d-flex flex-column justify-content-center">               
                <h1 className="mt-2  text-center" style={{color: "#e8baba"}}>{t('auth.login')}</h1>
                <form
                  onSubmit={onSubmitHandler}
                  className="  my_form"
                  style={{ width: 500, height: 400 }}
                >
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{color: "#e8baba"}}>
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
                    <div className="invalid-feedback">
                      Please enter a valid email.
                    </div>
                  </div>

                  <div className="mb-1">
                    <label htmlFor="password" className="form-label" style={{color: "#e8baba"}}>
                    {t('auth.password')}
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errorMessage ? "is-invalid" : ""
                      }`}
                      name="password"
                      value={state.password}
                      onChange={onChangeInputHandler}
                      placeholder={t('auth.enterPassword')}
                      required
                    />
                    {errorMessage && (
                      <div className="invalid-feedback">{errorMessage}</div>
                    )}
                  </div>

                  <div className="text-center mb-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      style={{color: "#e8baba"}}
                      onClick={onClickHandler}
                    >
                      {t('auth.forgotPassword')}?
                    </button>
                    {showModal && (
                      <SendEmailModal
                        showModal={showModal}
                        handleModal={handleModal}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <button type="submit" className="cart-btn m-2" style={{width: "300px"}}>
                    {t('auth.login')}
                    </button>
                  </div>
                  <hr></hr>
                  <div className="text-center">
                    <div className="col-md-12">
                      <GoogleAuth onError={handleGoogleAuthError}></GoogleAuth>
                    </div>
                  </div>
                </form>
                <p className="text-center mt-5" style={{color: "#e8baba"}}>
                {t('auth.notMember')}?
                  <Link to="/account/register">
                    <button
                       className="back-btn" style={{padding: "10px", width: "200px", marginLeft: 10 }}
                    >
                      {t('auth.register')}
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
        >
        </div>
      </div>
    </div>
  </>
);

}



export default LoginPage;