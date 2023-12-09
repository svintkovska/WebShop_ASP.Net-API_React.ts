import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, redirect, useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { AuthActionType, IAuthUser } from "../../auth/types";
import { useEffect } from "react";

const AdminHeader = () =>{
    const navigator = useNavigate()
    const {isAuth} = useSelector((store: any) => store.auth as IAuthUser);
    const {email} = useSelector((store: any) => store.auth as IAuthUser);
    const {imagePath} = useSelector((store: any) => store.auth as IAuthUser);
    const {roles} = useSelector((store: any) => store.auth as IAuthUser);
    const isAdmin = roles.includes('admin');
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!isAdmin) {
        navigate("/");
      }
    }, []);
    

    const dispatch = useDispatch();

    const handleLogOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('imagePath');
        localStorage.removeItem('roles');
        localStorage.removeItem('basket');

        navigator('/account/login');
        dispatch({type: AuthActionType.USER_LOGOUT})
    }

   
    return (
      <>
      
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(105, 185, 224)' }}>
          <div className="container">
            <Link className="navbar-brand m-4" to="/admin">
              Admin
            </Link>

            <Link className="navbar-brand m-4" to="/" style={{color: "red"}}>
            Shop
          </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item m-3">
                  <Link to="/admin/categories/list" className="nav-link " aria-current="page">
                    Categories
                  </Link>
                </li>
                <li className="nav-item m-3">
                  <Link to="/admin/products/list" className="nav-link">
                    Products
                  </Link>
                </li>
                <li className="nav-item m-3">
                  <Link to="/admin/users/list" className="nav-link">
                    Users
                  </Link>
                </li>
                <li className="nav-item m-3">
                  <Link to="/admin/orders/list" className="nav-link">
                    Orders
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                {isAuth ? (
                  <>
                    <li className="nav-item nav-link active">Hello {email}</li>
                    <li className="nav-item nav-link">
                      <img
                        src={APP_ENV.IMAGE_PATH + "300_" + imagePath}
                        width="40"
                        height="40"
                      ></img>
                    </li>                   
                    <li className="nav-item">
                      <button
                        onClick={handleLogOut}
                        className="nav-link btn btn-link"
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/3168/3168315.png"
                          width="40"
                          height="40"
                        />
                      </button>
                    </li>
                  </>
                ) : (
                  <>                   
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
}

export default AdminHeader;