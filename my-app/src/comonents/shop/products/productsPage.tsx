import classNames from "classnames";
import qs from "qs";
import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useNavigation, useParams, useSearchParams } from 'react-router-dom';
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { addToBasket } from "../BasketReducer";
import { IBasket, IBasketProduct } from "../types";
import AddToBasketModal from "./addToBasketModal";
import { IProductItem, IProductResult, IProductSearch } from "./types";



const ProductsPage = ()=>{

    const { categoryId } = useParams();


        const [products, setProducts] = useState<Array<IProductItem>>([]);
        const [searchParams, setSearchParams] = useSearchParams();
        const {basket} = useSelector((store: any) => store.basket as IBasket);
        const dispatch = useDispatch();
        const [showModal, setShowModal] = useState(false);
        
        const [data, setData] = useState<IProductResult>({
            pages: 0,
            products: [],
            total: 0,
            currentPage:0
        });
      
        const [search, setSearch] = useState<IProductSearch>({
            categoryId: categoryId as string,
            name: searchParams.get("name") || "",
            description: searchParams.get("description") || "",
            page: searchParams.get("page") || 1,
        });
      
        function filterNonNull(obj: IProductSearch) {
            return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
          }
      
          const buttons = [];
          for (let i = 1; i <= data.pages; i++) {
            buttons.push(i);
          }
      
          const pagination = buttons.map((page) => (
            <li key={page} className="page-item">
              <Link
                className={classNames("page-link", { active: data.currentPage === page })}
                onClick={() => setSearch({ ...search, page })}
                to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
              >
                {page}
              </Link>
            </li>
          ));
      
          useEffect(() => {
            console.log("search", search);
            http.
                get<IProductResult>(`api/Shop/products/${categoryId}`, {
                    params: search
                })
                .then((resp) => {
                    console.log("porducts list", resp.data);
                    setData(resp.data);
                    setProducts(resp.data.products);
                });
            }, [search]);

            const handleAddToCart = (product: IProductItem) => {
              const selectedProduct: IBasketProduct = {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  quantity: 1,
                };
      
              let existingBasket: IBasketProduct[] = JSON.parse(localStorage.getItem("basket") || "[]");
              let productExists = false;
            
              existingBasket = existingBasket.map((basketProduct) => {
                if (basketProduct.id === selectedProduct.id) {
                  basketProduct.quantity += selectedProduct.quantity;
                  productExists = true;
                }
                return basketProduct;
              });
            
              if (!productExists) {
                existingBasket.push(selectedProduct);
              }
            
              localStorage.setItem("basket", JSON.stringify(existingBasket));
              dispatch(addToBasket(existingBasket));
      
              setShowModal(true);
      
          };
          
         

          
          const location = useLocation();
          const categoryName = location.state && location.state.categoryName;

console.log("location.state", location);

const navigate = useNavigate();
const handleProductClick = (productId: number, productName: string) => {
  navigate(`/shop/products/productItem/${productId}`, { state: { categoryName, categoryId, productName } });
};

          const navigation  = ()=>{
            return (
              <nav className="d-flex justify-content-left">
                <ul className="list-unstyled">
                  <li>
                    <a href="/">Home Page -{'>'} </a>
                  </li>
                </ul>
                <ul className="list-unstyled">
                  <li>
                    <a href="/shop/categories">Menu -{'>'} </a>
                  </li>
                </ul>
                <ul className="list-unstyled">
                <li>
                    <a href={`/shop/products/${categoryId}`}>{categoryName} </a>
                  </li>
                </ul>
              </nav>
            );
          }
    
          
    const cardItem = products.map((product) => (
      <Col key={product.id}>
        <Card>

            <Card.Img
              variant="top"
              src={APP_ENV.IMAGE_PATH + "300_" + product.images[0]}
              alt={product.name}
              style={{
                maxHeight: "200px",
                minHeight: "200px",
                cursor: "pointer",
              }}
              onClick={() => handleProductClick(product.id, product.name)}

            />


          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text className="text-truncate" style={{ maxHeight: "100px" }}>
              {" "}
              {product.description}{" "}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col>
                <Button variant="primary" size="lg" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
                <AddToBasketModal show={showModal} onClose={() => setShowModal(false)} />

              </Col>
              <Col>
                <Card.Text>{product.price}</Card.Text>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    ));




    return (
      <>
        <Container className="my-3" style={{ maxWidth: "900px" }}>
          <div>{navigation()}</div>
          <h1>Products</h1>
          <Row xs={1} md={2} lg={3} className="g-4">
            {cardItem}
          </Row>
          <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination mt-5">{pagination}</ul>
          </nav>
          </div>
          
        </Container>
      </>
    );
}

export default ProductsPage;