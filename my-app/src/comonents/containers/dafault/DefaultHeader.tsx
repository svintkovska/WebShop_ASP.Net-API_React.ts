import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { AuthActionType, IAuthUser } from "../../auth/types";

const DefaultHeader = () =>{
    const navigator = useNavigate()
    const {isAuth} = useSelector((store: any) => store.auth as IAuthUser);
    const {email} = useSelector((store: any) => store.auth as IAuthUser);
    const {imagePath} = useSelector((store: any) => store.auth as IAuthUser);

    const dispatch = useDispatch();

    const handleLogOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('imagePath');

        navigator('/account/login');
        dispatch({type: AuthActionType.USER_LOGOUT})
    }

    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">
              My App
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
                <li className="nav-item">
                  <Link to="/categories/list" className="nav-link active" aria-current="page">
                    Categories
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/products/list" className="nav-link">
                    Products
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {isAuth ? (
                  <>
                    <li className="nav-item nav-link active">Hello {email}</li>
                    <li className="nav-item nav-link">
                      <img
                        src={APP_ENV.IMAGE_PATH + imagePath}
                        width="40"
                        height="40"
                      ></img>
                    </li>
                    <li className="nav-item">
                      <Link to="account/editProfile" className="nav-link">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/9653/9653837.png"
                          width="40"
                          height="40"
                        ></img>
                      </Link>
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
                    <li className="nav-item">
                      <Link to="account/register" className="nav-link">
                        Register
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="account/login" className="nav-link">
                        Log In
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
}

export default DefaultHeader;