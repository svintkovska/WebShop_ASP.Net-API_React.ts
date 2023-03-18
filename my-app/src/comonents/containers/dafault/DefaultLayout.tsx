import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { IAuthUser } from "../../auth/types";
import AdminHeader from "./AdminHeader";
import DefaultHeader from "./DefaultHeader";

const DefaultLayout = () =>{
  const {roles} = useSelector((store: any) => store.auth as IAuthUser);
  
  const isAdmin = roles.includes('admin');

    return (
      <>
    {isAdmin ? (
      <AdminHeader />
    ) : (
      <DefaultHeader />
    )}
    <div className="container">
      <Outlet />
    </div>

{/* <DefaultHeader />
        <div className="container">
          <Outlet />
        </div>
     </> */}

     </>
             
    );
}

export default DefaultLayout;