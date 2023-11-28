import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { IAuthUser } from "../../auth/types";
import DefaultHeader from "./DefaultHeader";
import Footer from "./Footer";

const DefaultLayout = () =>{

    return (
      <>
      <div className="hero_area">
      <DefaultHeader />
        <div >
          <Outlet />
        </div>
        <Footer/>
      </div>
    
      </>
    );
}

export default DefaultLayout;