import { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
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
        <Card>
          <Card.Img variant="top" src={APP_ENV.IMAGE_PATH + category.image} alt={category.name}
          style={{ maxHeight: "200px", minHeight: "200px" }} />
          <Card.Body>
            <Card.Title>{category.name}</Card.Title>
          </Card.Body>
          <Card.Footer>
            <a href={`/category/${category.id}`} className="btn btn-primary">
              View Products
            </a>
          </Card.Footer>
        </Card>
      </Col>
    ));




    return (
      <>
         <Container className="my-3" style={{ maxWidth: "900px" }}>
      <h1>Categories</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {cardItem}
      </Row>
    </Container>
      </>
    );
}

export default CategoriesPage;
