import { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { APP_ENV } from "../../../env";
import http from "../../../http";
import React from "react";



interface ICategoryItem{
    id: number,
    name: string,
    image: string,
    description: string
}


const CategoriesPage = ()=>{


    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

      useEffect(() => {
        http.
            get<Array<ICategoryItem>>("api/Categories")
            .then((resp) => {
              setCategories(resp.data);
            });
        }, []);


    const сardItem = categories.map((category) => (
      <React.Fragment key={category.id}>
        <div className="news-card" key={category.id} onClick={() => handleCategoryClick(category.id, category.name)}>
          <a href="#" className="news-card__card-link"></a>
          <img
            src={APP_ENV.IMAGE_PATH + "300_" + category.image}
            alt={category.name}
            className="news-card__image"
            
          />
          <div className="news-card__text-wrapper">
            <h2 className="news-card__title">
             {category.name}
            </h2>
            <div className="news-card__details-wrapper">
              <p className="news-card__excerpt">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    ));
    const navigate = useNavigate();

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/shop/products/${categoryId}`, { state: { categoryName, categoryId } });
  };

      const navigation  = ()=>{
        return (
          <nav className="d-flex justify-content-left mb-3 mt-3">
            <ul className="list-unstyled me-2">
              <li>
                <a href="/">Home Page -{'>'}</a>
              </li>
            </ul>
            <ul className="list-unstyled">
              <li>
                <a href="/shop/categories">Menu</a>
              </li>
            </ul>
          </nav>
        );
      }


    return (
      <>
        {/* <Container className="my-3" style={{ maxWidth: "900px" }}>
          <div>{navigation()}</div>

          <Row xs={1} md={2} lg={3} className="g-4">
            {cardItem}
          </Row>
        </Container> */}


          <div>{navigation()}</div>

          <div className="content-wrapper">{сardItem}</div>

      </>
    );
}

export default CategoriesPage;
