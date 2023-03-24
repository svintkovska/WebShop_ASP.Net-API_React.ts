import { url } from "inspector";
import { Link } from "react-router-dom";

const AdminHomePage = ()=>{

  
    return (
      <>
        <div
          className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center"
          style={{
            backgroundImage: "url(https://wallpaperaccess.com/full/16668.jpg",
            backgroundSize: "cover",
          }}
        >
        <h1 className="text-light mt-5 mb-5">ADMIN CENTER</h1>
          <Link to="/shop/categories">
            <button className="btn btn-outline-info">Go to the shop </button>
          </Link>
        </div>
      </>
    );
}

export default AdminHomePage;
