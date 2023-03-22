import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { addToBasket } from "../BasketReducer";
import { IBasket, IBasketProduct } from "../types";
import AddToBasketModal from "./addToBasketModal";
import { IProductItem } from "./types";

const ProductItemPage = () => {
    const { productId } = useParams();
    const {basket} = useSelector((store: any) => store.basket as IBasket);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    let prodIdNumber = -1;
    if (productId) {
      prodIdNumber = parseInt(productId, 10);
    }

    const [product, setProduct] = useState<IProductItem>({
      id: prodIdNumber,
      name: "",
      price: 0,
      images: [],
      description: "",
    });

    useEffect(() => {
      http
        .get<IProductItem>(`api/Shop/productItem/${productId}`)
        .then((resp) => {
          setProduct(resp.data);
          setProduct(resp.data);
        });
    }, [productId]);

    const [mainImage, setMainImage] = useState<string>(product.images[0] || "");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
      if (product.images.length > 0) {
        setMainImage(product.images[0]);
      }
    }, [product.images]);

    const handleImageClick = (image: string) => {
      setMainImage(image);
    };

    const handleQuantityChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newQuantity = parseInt(event.target.value);
      if (newQuantity > 0) {
        setQuantity(newQuantity);
      }
    };

    const handleDecreaseQuantity = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };

    const handleIncreaseQuantity = () => {
      setQuantity(quantity + 1);
    };
    const handleAddToCart = () => {
        const selectedProduct: IBasketProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
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

        setQuantity(1);
        setShowModal(true);

    };
    const location = useLocation();
    const categoryName = location.state && location.state.categoryName;
console.log("location.state", location);

const categoryId = location.state && location.state.categoryId;

const navigate = useNavigate();

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/shop/products/${categoryId}`, { state: { categoryName, categoryId } });
  };
  
    const navigation  = ()=>{
      return (
        <nav className="d-flex justify-content-left">
          <ul className="list-unstyled">
            <li>
              <a href="/">Home Page  -{'>'}</a>
            </li>
          </ul>
          <ul className="list-unstyled">
            <li>
              <a href="/shop/categories"> Menu -{'>'} </a>
            </li>
          </ul>
          <ul className="list-unstyled">
            <li>
              <a onClick={() => handleCategoryClick(categoryId, categoryName)} href={`/shop/products/${categoryId}`}>{categoryName}  -{'>'} </a>
            </li>
          </ul>
          <ul className="list-unstyled">
            <li>
              <a href={`/shop/products/productItem/${productId}`}>{product.name} </a>
            </li>
          </ul>
        </nav>
      );
    }
    return (
      <>
        <Container>
          <div>{navigation()}</div>
          <Row className="my-4">
            <Col md={6}>
              <div className="d-flex flex-column align-items-center">
                <img
                  src={APP_ENV.IMAGE_PATH + "300_" + mainImage}
                  alt={product.name}
                  className="img-fluid mb-4"
                  style={{ height: "400px", objectFit: "contain" }}
                />
                <div className="d-flex flex-wrap justify-content-center">
                  {product.images.map((image, index) => (
                    <div key={index} className="p-1">
                      <img
                        src={APP_ENV.IMAGE_PATH + "300_" + image}
                        alt={product.name}
                        className={`img-thumbnail ${
                          image === mainImage
                            ? "border-primary"
                            : "border-secondary"
                        }`}
                        style={{ cursor: "pointer", maxHeight: "100px" }}
                        onClick={() => handleImageClick(image)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-top">
                  <div>
                    <Card.Title className="mb-5" style={{ fontSize: "30px" }}>
                      {product.name}
                    </Card.Title>
                    <Card.Subtitle
                      className="mb-5 text-muted"
                      style={{ fontSize: "20px" }}
                    >
                      ₴ {product.price.toFixed(2)}
                    </Card.Subtitle>
                    <Card.Text className="mb-5">
                      {product.description}
                    </Card.Text>
                  </div>

                  <div className="d-flex justify-content-center align-items-center mt-5">
                    <Row>
                      <Col>
                        <div className="input-group">
                          <span className="input-group-prepend">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={handleDecreaseQuantity}
                            >
                              -
                            </button>
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            style={{ maxWidth: "80px", minWidth: "50px" }}
                            value={quantity}
                            onChange={handleQuantityChange}
                          />
                          <span className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={handleIncreaseQuantity}
                            >
                              +
                            </button>
                          </span>
                        </div>
                      </Col>

                      <Col>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleAddToCart}
                        >
                          Add to Cart
                        </Button>
                        <AddToBasketModal show={showModal} onClose={() => setShowModal(false)} />

                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
}

export default ProductItemPage;