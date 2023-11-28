import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { AuthActionType, IAuthUser } from "../../auth/types";
import { useEffect, useState } from "react";
import http from "../../../http";
import { Dropdown } from "react-bootstrap";

interface ICategoryItem{
  id: number,
  name: string,
  image: string,
  description: string
}

const DefaultHeader = () =>{
    const navigator = useNavigate()
    const {isAuth} = useSelector((store: any) => store.auth as IAuthUser);
    const {email} = useSelector((store: any) => store.auth as IAuthUser);
    const {imagePath} = useSelector((store: any) => store.auth as IAuthUser);
    const {roles} = useSelector((store: any) => store.auth as IAuthUser);
    const isAdmin = roles.includes('admin');
  
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


    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

      useEffect(() => {
        http.
            get<Array<ICategoryItem>>("api/Categories")
            .then((resp) => {
              setCategories(resp.data);
            });
        }, []);
 
        const handleCategoryClick = (categoryId: number, categoryName: string) => {
          navigator(`/shop/products/${categoryId}`, { state: { categoryName, categoryId } });
        };

        const renderCategoryDropdown = () => {
          return (
            <Dropdown>
              <Dropdown.Toggle variant="danger" style={{backgroundColor: "#f9ece6", color: "#514f4f"}} id="dropdown-basic">
                All Categories
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {categories.map(category => (
                  <Dropdown.Item key={category.id}>
                  <NavLink className="nav-link" to={`/shop/products/${category.id}`}>
                    {category.name}
                  </NavLink>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          );
        };
    return (
      <>
        <header className="header_section">
          <nav className="navbar navbar-expand-lg custom_nav-container">
            <NavLink className="navbar-brand" to="/">
              <Link className="navbar-brand" to="/">
                <span>Giftos</span>
              </Link>
            </NavLink>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/shop/categories">
                    Shop
                  </NavLink>
                </li>
                <li className="nav-item ">
                {renderCategoryDropdown()}
                </li>
                {isAdmin ? (
                  <NavLink className="nav-link" to="/admin">
                    <span className="text-danger">Admin Center</span>
                  </NavLink>
                ) : (
                  ""
                )}
              </ul>

              <ul className="navbar-nav">
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
                      <Link to="account/editProfile" className="nav-link">
                        <img
                          src="		https://cdn-icons-png.flaticon.com/512/2657/2657960.png"
                          width="40"
                          height="40"
                          title="Edit Profile"
                        ></img>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="shop/userOrders" className="nav-link">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/7544/7544599.png"
                          width="40"
                          height="40"
                          title="My Orders"
                        ></img>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="shop/basket" className="nav-link">
                        <img
                          src="	https://cdn-icons-png.flaticon.com/512/4675/4675305.png"
                          width="40"
                          height="40"
                          title="Basket"
                        ></img>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button
                        onClick={handleLogOut}
                        className="nav-link btn btn-link"
                      >
                        <img
                          src="	https://cdn-icons-png.flaticon.com/512/5593/5593396.png"
                          width="40"
                          height="40"
                          title="Log out"
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
          </nav>
        </header>
      </>
    );
}

export default DefaultHeader;