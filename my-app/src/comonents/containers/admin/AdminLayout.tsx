import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { IAuthUser } from "../../auth/types";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const { roles } = useSelector((store: any) => store.auth as IAuthUser);
  const isAdmin = roles.includes('admin');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) navigate("/account/login");
  }, []);

  return (
    <>
      <AdminHeader />
      <div >
        { isAuth && isAdmin && <Outlet /> }
      </div>
    </>
  );
};

export default AdminLayout;