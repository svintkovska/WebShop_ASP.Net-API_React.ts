import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { IAuthUser } from "../../auth/types";
import DefaultHeader from "./DefaultHeader";

const DefaultLayout = () =>{

    return (
      <>
        <DefaultHeader />
        <div className="container">
          <Outlet />
        </div>
      </>
    );
}

export default DefaultLayout;