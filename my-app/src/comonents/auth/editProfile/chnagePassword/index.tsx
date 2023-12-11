import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import http from "../../../../http";
import SuccessMessage from "../../../common/SuccessMessage";
import { IAuthUser } from "../../types";
import { useTranslation } from 'react-i18next';


interface IChangePassword {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    }


const ChangePassword = () =>{
  const { t } = useTranslation();
    const {email} = useSelector((store: any) => store.auth as IAuthUser);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<boolean>(false);

    const [state, setState] = useState<IChangePassword>({
      email: email,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });



    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) =>{
        setState({...state, [e.target.name]: e.target.value});
    }


    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log(state);

        if (state.newPassword !== state.confirmPassword) {
          setErrorMessage(t('messages.passwordsDontMatch'));
          return;
        }
        if (state.newPassword.length < 6) {
          setErrorMessage(t('messages.passwordShort'));
          return;
        }
        try{
          const result = await http
          .post(`api/Account/edit/changePassword`, state)
          .then(resp => {
            setSuccessMessage(true);
          })
        }
        catch(error: any){
          console.log ("error:", error);
          setErrorMessage(t('messages.incorrectPassword'));
        }
        console.log ("Data sent", state);     
    }

    return (
        <>
        <div className="cart-card text-center profile_card" >
          <div className=" cart" style={{ borderRadius: "1rem" }}>
            <div className="title">
            <h4>
                  <b>{t('auth.changePassword')}</b>
                </h4>
          {successMessage && (
        <SuccessMessage message={t('auth.passwordChanged')} />
      )}
          {!successMessage && errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
          <form onSubmit={onSubmitHandler} className=" pb-2 pt-5 ps-5 pe-5 my_form"
            style={{ width: 500 }}>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label" style={{color: "#e8baba"}}>
              {t('auth.oldPassword')}
              </label>
              <input
                type="password"
                className="form-control"
                name="oldPassword"
                value={state.oldPassword}
                onChange={onChangeInputHandler}
                placeholder={t('auth.enterOldPassword')}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label" style={{color: "#e8baba"}}>
              {t('auth.newPassword')}
              </label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={state.newPassword}
                onChange={onChangeInputHandler}
                placeholder={t('auth.enterNewPassword')}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label " style={{color: "#e8baba"}}>
              {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={onChangeInputHandler}
                placeholder={t('auth.confirmPassword')}
                required
              />
            </div>
           
            <div className="text-center mb-3">
              <button type="submit" className="cart-btn" style={{width: "300px"}}>
              {t('auth.changePassword')}
              </button>
            </div>
          </form>
          <Link to="/account/editProfile">
                <button className="back-btn" style={{padding: "10px", width: "200px"}}>{t('auth.goBackToProfile')}</button>
          </Link>
        </div>
        </div>
        </div>
      </>

    );

}


export default ChangePassword;