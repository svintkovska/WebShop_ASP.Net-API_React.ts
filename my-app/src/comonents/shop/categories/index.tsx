import { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { APP_ENV } from "../../../env";
import http from "../../../http";



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


          
    const cardItem = categories.map((category) => (
        <Col key={category.id}>
        <Card style={{backgroundColor: "gray"}}>
          <Card.Img variant="top" src={APP_ENV.IMAGE_PATH + "300_" + category.image} alt={category.name}
          style={{ maxHeight: "200px", minHeight: "200px", cursor: "pointer" }} 
          onClick={() => handleCategoryClick(category.id, category.name)}
          />
          
          <Card.Body className="text-center">
            <Card.Title>{category.name}</Card.Title>
          </Card.Body>
          
        </Card>
      </Col>
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
        <Container className="my-3" style={{ maxWidth: "900px" }}>
          <div>{navigation()}</div>

          <Row xs={1} md={2} lg={3} className="g-4">
            {cardItem}
          </Row>
        </Container>
      </>
    );
}

export default CategoriesPage;
