import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { IAuthUser } from "../../auth/types";
import DefaultHeader from "./DefaultHeader";

const DefaultLayout = () =>{

    return (
      <>
      <div className="hero_area">
      <DefaultHeader />
        <div >
          <Outlet />
        </div>
      </div>
    
      </>
    );
}

export default DefaultLayout;