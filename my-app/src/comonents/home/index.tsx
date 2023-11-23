import { Link } from "react-router-dom";
import img from '../../assets/images/slider-img.png'
import img2 from '../../assets/images/sale.png'
import img3 from '../../assets/images/fashion-girl.png'
import { Carousel } from "react-bootstrap";
import { useEffect } from "react";

const HomePage = ()=>{

    return (
      <>
        {/* <div
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

          
        </div> */}
        <section className="slider_section">
          <div className="slider_container">
            <Carousel>
              <Carousel.Item>
                <img className="img-box" style={{height: "700px"}} src={img} alt="First slide" />
                <Carousel.Caption>
                  <div className="detail-box">
                    <h1>
                      Welcome To Our <br />
                      Gift Shop
                    </h1>
                    <p>
                      Sequi perspiciatis nulla reiciendis, rem, tenetur impedit,
                      eveniet non necessitatibus error distinctio mollitia
                      suscipit. Nostrum fugit doloribus consequatur distinctio
                      esse, possimus maiores aliquid repellat beatae cum,
                      perspiciatis enim, accusantium perferendis.
                    </p>
                    <Link to="/shop/categories">
                      Start Shopping
                    </Link>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-box" style={{height: "700px"}} src={img2} alt="Second slide" />
                <Carousel.Caption>
                  <div className="detail-box">
                    <h1>
                      Welcome To Our <br />
                      Gift Shop
                    </h1>
                    <p>
                      Sequi perspiciatis nulla reiciendis, rem, tenetur impedit,
                      eveniet non necessitatibus error distinctio mollitia
                      suscipit. Nostrum fugit doloribus consequatur distinctio
                      esse, possimus maiores aliquid repellat beatae cum,
                      perspiciatis enim, accusantium perferendis.
                    </p>
                    <Link to="/shop/categories" >
                      Start Shopping 
                    </Link>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img className="img-box" style={{height: "700px"}} src={img3} alt="Third slide" />
                <Carousel.Caption>
                  <div className="detail-box">
                    <h1>
                      Welcome To Our <br />
                      Gift Shop
                    </h1>
                    <p>
                      Sequi perspiciatis nulla reiciendis, rem, tenetur impedit,
                      eveniet non necessitatibus error distinctio mollitia
                      suscipit. Nostrum fugit doloribus consequatur distinctio
                      esse, possimus maiores aliquid repellat beatae cum,
                      perspiciatis enim, accusantium perferendis.
                    </p>
                    <Link to="/shop/categories">
                      Start Shopping 
                    </Link>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </section>
      </>
    );
}

export default HomePage;
