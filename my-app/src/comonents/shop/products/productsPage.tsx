import classNames from "classnames";
import qs from "qs";
import { useState, useEffect, ChangeEvent } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { IAuthUser } from "../../auth/types";
import { addToBasket } from "../BasketReducer";
import { IBasket, IBasketProduct } from "../types";
import AddToBasketModal from "./addToBasketModal";
import { IProductItem, IProductResult, IProductSearch } from "./types";
import React from "react";
import { useTranslation } from 'react-i18next';

const ProductsPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [products, setProducts] = useState<Array<IProductItem>>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { basket } = useSelector((store: any) => store.basket as IBasket);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);
  const navigate = useNavigate();
  const [data, setData] = useState<IProductResult>({
    pages: 0,
    products: [],
    total: 0,
    currentPage: 0,
  });

  const [search, setSearch] = useState<IProductSearch>({
    categoryId: categoryId || "",
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
        className={classNames("page-link", {
          active: data.currentPage === page,
        })}
        onClick={() => setSearch({ ...search, page })}
        to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
      >
        {page}
      </Link>
    </li>
  ));
  useEffect(() => {
    setSearch({
      ...search,
      categoryId: categoryId || "",
    });
  }, [categoryId]);

  useEffect(() => {
    http
      .get<IProductResult>(`api/Shop/products/${categoryId}`, {
        params: search,
      })
      .then((resp) => {
        console.log("porducts list", resp.data);
        setData(resp.data);
        setProducts(resp.data.products);
      });
  }, [search]);

  const handleAddToCart = (product: IProductItem) => {
    if (!isAuth) {
      navigate("/account/login");
    } else {
      const selectedProduct: IBasketProduct = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      };

      let existingBasket: IBasketProduct[] = JSON.parse(
        localStorage.getItem("basket") || "[]"
      );
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

      setShowModal(true);
    }
  };

  const onChangeInputHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const location = useLocation();
  const categoryName = location.state && location.state.categoryName;
  
  console.log("====================",location.state);
  const handleProductClick = (productId: number, productName: string) => {
    navigate(`/shop/products/productItem/${productId}`, {
      state: { categoryName, categoryId, productName },
    });
  };


  const cardItem = products.map((product) => (
    <React.Fragment key={product.id}>
        <div className="product-grid">
          <div className="product-image">
            <a href="#" className="image">
              <img
                className="pic-1"
                src={APP_ENV.IMAGE_PATH + "600_" + product.images[0]}
                alt={product.name}
                style={{objectFit: 'contain'}}
              />
            </a>
            <ul className="product-links">
              <li>
                <a href="#" onClick={() => handleAddToCart(product)}>
                  <i className="fa fa-shopping-bag"></i> {t('shop.product.addToCart')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleProductClick(product.id, product.name)}
                >
                  <i className="fa fa-search"></i> {t('shop.product.quickView')}
                </a>
              </li>
            </ul>
          </div>

          <div className="product-content">
            <h3 className="title">
              <a href="#">{product.name}</a>
            </h3>
            <div className="price">₴ {product.price}</div>
          </div>
        </div>
    </React.Fragment>
  ));

  return (
    <>
      <Container className="d-flex flex-column justify-content-start">
        <div className="d-flex flex-row justify-content-center mt-3 mb-3">
          <div className="mb-3  me-5 ">
            <label htmlFor="name" className="form-label d-none"></label>
            <input
              type="text"
              className="form-control search_input"
              name="name"
              value={search.name}
              onChange={onChangeInputHandler}
              placeholder= {t('common.searchByName')}
            />
          </div>
          <div className="mb-3 me-5">
            <label htmlFor="description" className="form-label d-none"></label>
            <input
              type="text"
              className="form-control search_input"
              name="description"
              value={search.description}
              onChange={onChangeInputHandler}
              placeholder= {t('common.searchByDescription')}
            />
          </div>
        </div>

        <div className="proudcts-container" >
          {cardItem}
        </div>


        <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination mt-5">{pagination}</ul>
          </nav>
        </div>
        <AddToBasketModal
            show={showModal}
            onClose={() => setShowModal(false)}
          />
      </Container>
    </>
  );
};

export default ProductsPage;
