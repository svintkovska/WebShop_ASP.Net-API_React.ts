import { Link } from "react-router-dom";

const HomePage = ()=>{

  
    return (
      <>
        <Link to="/categories">
                <button className="btn btn-outline-success">Go to Categories </button>
          </Link>
      </>
    );
}

export default HomePage;
