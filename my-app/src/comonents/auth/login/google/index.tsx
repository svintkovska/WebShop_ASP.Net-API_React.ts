import { useEffect, useState } from "react";
import { APP_ENV } from "../../../../env";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface GoogleData {
  token: string;
  firstName: string;
  lastName: string;
  image: string;
}




const GoogleAuth= ()=> {
const navigate = useNavigate();

  const [state, setState] = useState<GoogleData>({
    token: "",
    firstName: "",
    lastName: "",
    image: ""
  });


    const handleLogIn = async (resp: any) => {
      const { credential } = resp;
      const userObject = jwt_decode(credential) as any;
   
      console.log("userObject----", userObject);

      await setState({
        token: credential,
        firstName: userObject.given_name,
        lastName: userObject.family_name,
        image: userObject.picture
      });
      console.log("setState----", state);

      try {
        const result = await axios
          .post("http://localhost:5285/api/account/google/login", state)
          .then((resp) => {
            console.log("token - ", resp.data.token.result);

            localStorage.setItem("token", resp.data.token.result);

            axios.defaults.headers.common = {
              Authorization: `Bearer ${resp.data.token.result}`,
            };
            navigate("/");
          });
      } catch (error: any) {
        console.log("error:", error);
      }
      console.log("Data sent", state);
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

      <div id="googleButton" className="d-flex justify-content-center mb-3">

      </div>


        {/* <a className="btn btn-outline-primary text-uppercase mb-4" href="#">
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" />{" "}
          Log In with Google
        </a> */}
      </>
    );
}

export default GoogleAuth;