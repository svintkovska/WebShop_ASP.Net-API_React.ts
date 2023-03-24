import { Link } from "react-router-dom";

const HomePage = ()=>{

  
    return (
      <>
        <div
          className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center"
          style={{
            backgroundImage: "url(https://cdn.shopify.com/s/files/1/0200/7466/articles/OSA_winners_-_OOTS_Blog_Posts_1400x.png?v=1605082671",
            backgroundSize: "cover",
          }}
        >
        <h1 className="text-light mt-5 mb-5">WELCOME TO OUR SHOP</h1>
          <Link to="/shop/categories">
            <button className="btn btn-outline-info">Start Shopping </button>
          </Link>
        </div>
      </>
    );
}

export default HomePage;
