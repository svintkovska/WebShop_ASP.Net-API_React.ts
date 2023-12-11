import { useEffect, useState } from "react";
import {  Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate, useParams } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { addToBasket } from "../BasketReducer";
import { IAuthUser } from "../../auth/types";
import { IBasket, IBasketProduct } from "../types";
import AddToBasketModal from "./addToBasketModal";
import { IProductItem } from "./types";
import { useTranslation } from 'react-i18next';

const ProductItemPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

    const { productId } = useParams();
    const {basket} = useSelector((store: any) => store.basket as IBasket);
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);
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
      if (!isAuth) {
        navigate("/account/login");
      } else {
        const selectedProduct: IBasketProduct = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
          };

        let existingBasket: IBasketProduct[] = JSON.parse(localStorage.getItem("basket") || "[]");
        let productExists = false;
      
        existingBasket = existingBasket.map((basketProduct) => {
          if (basketProduct.productId === selectedProduct.productId) {
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
      }
    };

  
    
    return (
      <>
        <Container className="mt-5 mb-5">
          <div className="row">
            <div className="col m-0" >
              <div className="photo-container">
                <div className="photo-main">
                <img
                src={APP_ENV.IMAGE_PATH + "1200_" + mainImage}
                alt={product.name}
              />
                </div>
              
              </div>
            
              <div className="photo-album" >
                <ul>
                  {product.images.map((image, index) => (
                    <li>
                      <img
                        src={APP_ENV.IMAGE_PATH + "1200_" + image}
                        alt={product.name}
                        width={50}
                        height={50}
                        style={{ cursor: "pointer", objectFit: "contain" }}
                        onClick={() => handleImageClick(image)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col product__info m-0" >
            <div className="row ">
                <h1 className="title"> {product.name}</h1>
              </div>
              <div className="price">
                ₴ <span> {product.price.toFixed(2)}</span>
              </div>

              <div className="description">
                <h3>{product.description}</h3>
              </div>

              <div className="d-flex justify-content-center align-items-center mb-5">
                <div className="input-group">
                  <span className="input-group-prepend">
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={handleDecreaseQuantity}
                    >
                      -
                    </button>
                  </span>
                  <input
                    type="number"
                    className="form-control text-center"
                    style={{ maxWidth: "70px", minWidth: "50px" }}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                  <span className="input-group-append">
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={handleIncreaseQuantity}
                    >
                      +
                    </button>
                  </span>
                </div>
              </div>
              <button className="back-btn" style={{ padding: "10px", maxWidth: "300px" }} onClick={handleAddToCart}>
                {t("shop.product.addToCart")}
              </button>
            </div>
          </div>
          <AddToBasketModal
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        </Container>
      </>
    );
}

export default ProductItemPage;