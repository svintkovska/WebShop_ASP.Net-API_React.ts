import { url } from "inspector";
import { Link } from "react-router-dom";

const AdminHomePage = ()=>{

  
    return (
      <>
        <h1 className="text-light text-center mt-5 mb-5">ADMIN CENTER</h1>
        <div
          className="cotainer text-center"
        >
          <Link to="/">
            <button className="btn btn-outline-info">Go to the shop </button>
          </Link>
        </div>
      </>
    );
}

export default AdminHomePage;
