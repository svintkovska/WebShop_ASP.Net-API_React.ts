import { useEffect } from "react";
import { APP_ENV } from "../../../../env";
import jwt_decode from "jwt-decode";
import axios from "axios";

const GoogleAuth= ()=> {

    const handleLogIn = (resp: any) =>{
      const {credential} = resp;
        console.log("login google", credential);
        const userObject = jwt_decode(credential);

        axios.post
        
    }

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
    }, [])
    


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