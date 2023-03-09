import { useEffect, useState } from "react";
import { APP_ENV } from "../../../../env";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface GoogleData {
  token: string;
  firstName: string;
  lastName: string;
  imagePath: string;
}




const GoogleAuth= ()=> {
const navigate = useNavigate();

  const [state, setState] = useState<GoogleData>({
    token: "",
    firstName: "",
    lastName: "",
    imagePath: ""
  });


    const handleLogIn = async (resp: any) => {
      const { credential } = resp;
      const userObject = jwt_decode(credential) as any;
   
      console.log("userObject----", userObject);

      const model: GoogleData = {
        token: credential,
        firstName: userObject.given_name,
        lastName: userObject.family_name,
        imagePath: userObject.picture
      };

    
      console.log("model----", model);

      try {
        const result = await axios
          .post("http://localhost:5285/api/account/google/login", model)
          .then((resp) => {
            if(resp.data.token == '')
            {
              const user = resp.data.user;
              const queryParams = `?googleToken=${credential}&email=${user.email}&firstName=${user.firstName}&lastName=${user.lastName}&imagePath=${user.image}`;
             navigate(`/account/register/googleRegistration${queryParams}`);
            }
            else{
              localStorage.setItem("token", resp.data.token);

              axios.defaults.headers.common = {
                Authorization: `Bearer ${resp.data.token}`,
              };          
              navigate("/");
            }           
          });
      } catch (error: any) {
        console.log("error:", error);
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