import { useEffect, useState } from "react";
import { APP_ENV } from "../../../../env";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import http from "../../../../http";
import { useDispatch } from "react-redux";
import { AuthActionType } from "../../types";
import { setEmail, setImage } from "../../AuthReducer";
import axios from "axios";

type GoogleAuthProps = {
  onError: (errorMessage: string) => void;
};

interface GoogleData {
  token: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  email: string;
}


const GoogleAuth= ({ onError }: GoogleAuthProps)=> {
const navigate = useNavigate();
const dispatch = useDispatch();

  const [state, setState] = useState<GoogleData>({
    token: "",
    firstName: "",
    lastName: "",
    imagePath: "",
    email: ""
  });

    const handleLogIn = async (resp: any) => {
      const { credential } = resp;
      const userObject = jwt_decode(credential) as any;
   
      const model: GoogleData = {
        token: credential,
        firstName: userObject.given_name,
        lastName: userObject.family_name,
        imagePath: userObject.picture,
        email: userObject.email
      };

      try {
        const result = await http
          .post("api/account/google/login", model)
          .then((resp) => {
            
            if(resp.data.token == '')
            {
              const user = resp.data.user;
              const queryParams = `?googleToken=${credential}&email=${user.email}&firstName=${user.firstName}&lastName=${user.lastName}&imagePath=${user.image}`;
             navigate(`/account/register/googleRegistration${queryParams}`);
            }
            else{
              localStorage.setItem("token", resp.data.token);
              localStorage.setItem("email", model.email);
              localStorage.setItem("imagePath", model.imagePath);


              axios.defaults.headers.common = {
                Authorization: `Bearer ${resp.data.token}`,
              };          

              dispatch({type: AuthActionType.USER_LOGIN});
              dispatch(setEmail(model.email));
              dispatch(setImage(model.imagePath));

              navigate("/");
            }           
          });
      } catch (error: any) {
        console.log("error:", error.response.data);
        onError(error.response.data);

      }
      console.log("Data sent", model);
    };

    useEffect(() => {
      window.google.accounts!.id.initialize({
        client_id: APP_ENV.GOOGLE_CLIENT_ID,
        callback: handleLogIn
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        {
        type: 'standard',
        size: 'large',
        theme: 'filled_black',
        text: 'continue_with',
        shape: "pill",
        width: '150',
        locale: "en_gb"
      })
    })
    
    return (
      <>
        <div
          id="googleButton"
          className="d-flex justify-content-center mb-3"
        ></div>
      </>
    );
}

export default GoogleAuth;