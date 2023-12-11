import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { IBasket, IBasketProduct } from "../types";
import empty_cart from '../../../assets/images/empty_cart.png'
import { useTranslation } from 'react-i18next';

const BasketPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { basket } = useSelector((store: any) => store.basket as IBasket);

  const calculateTotalPrice = () => {
    return basket.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };
  const handleRemoveProduct = (productId: number) => {
    dispatch({ type: "REMOVE_FROM_BASKET", payload: productId });
    const updatedBasket = basket.filter((item) => item.productId !== productId);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const onDecreaseQuantity = (productId: number) => {
    const updatedProduct = basket.find((item) => item.productId === productId);
    if (updatedProduct) {
      const updatedQuantity = updatedProduct.quantity - 1;
      if (updatedQuantity > 0) {
        const updatedBasketProduct = {
          ...updatedProduct,
          quantity: updatedQuantity,
        };
        dispatch({ type: "UPDATE_BASKET", payload: updatedBasketProduct });
        const updatedBasket = basket.map((item) =>
          item.productId === productId ? updatedBasketProduct : item
        );
        localStorage.setItem("basket", JSON.stringify(updatedBasket));
      } else {
        dispatch({ type: "REMOVE_FROM_BASKET", payload: productId });
        const updatedBasket = basket.filter(
          (item) => item.productId !== productId
        );
        localStorage.setItem("basket", JSON.stringify(updatedBasket));
      }
    }
  };

  const onIncreaseQuantity = (productId: number) => {
    const updatedProduct = basket.find((item) => item.productId === productId);
    if (updatedProduct) {
      const updatedQuantity = updatedProduct.quantity + 1;
      const updatedBasketProduct = {
        ...updatedProduct,
        quantity: updatedQuantity,
      };
      dispatch({ type: "UPDATE_BASKET", payload: updatedBasketProduct });
      const updatedBasket = basket.map((item) =>
        item.productId === productId ? updatedBasketProduct : item
      );
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
    }
  };


 
  return (
    <div className="cart-card">
      <div className="row">
        <div className="col-md-8 cart">
          <div className="title">
            <div className="row">
              <div className="col">
                <h4>
                  <b> {t("shop.product.cart")}</b>
                </h4>
              </div>
              <div className="col align-self-center text-right text-muted">
                {t("shop.product.items")}
              </div>
            </div>
          </div>
          {basket.length < 1 ? (
            <div className="text-center mt-5">
              <img className="empty_cart" src={empty_cart} />
              <p>
                <b className="text-danger">{t("shop.product.emptyCart")}</b>
              </p>
              <p>{t("shop.product.makeMeHappy")}</p>
            </div>
          ) : (
            <section>
              {basket.map((item) => (
                <div className="row border-top border-bottom ">
                  <div
                    className="row main align-items-center mycart"
                    key={item.productId}
                  >
                    <div className="col-2 d-flex justify-content-center">
                      <img
                        className="img-fluid"
                        src={APP_ENV.IMAGE_PATH + "300_" + item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="col d-flex justify-content-center">
                      <div className="row ">{item.name}</div>
                    </div>
                    <div className="col d-flex justify-content-center">
                      <div className="input-group d-flex justify-content-center">
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => onDecreaseQuantity(item.productId)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          style={{ maxWidth: "70px", minWidth: "50px" }}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => onIncreaseQuantity(item.productId)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col d-flex justify-content-center">
                      {(item.price * item.quantity).toFixed(2)} ₴{" "}
                    </div>
                    <div className="col d-flex justify-content-center">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleRemoveProduct(item.productId)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          <div className="back-to-shop">
            <Link to="/shop/categories">
              <a className="back-btn" style={{ padding: "10px" }}>
                {t("common.backToShop")}
              </a>
            </Link>
          </div>
        </div>
        <div className="col-md-4 summary">
          <div>
            <h5>
              <b>{t("shop.product.summary")}</b>
            </h5>
          </div>
          <div
            className="row"
            style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "2vh 0" }}
          >
            <div className="col">{t("shop.product.totalPrice")}</div>
            <div className="col text-right">
              {calculateTotalPrice().toFixed(2)} ₴
            </div>
          </div>
          <Link to="/shop/makeOrder">
            <button className="cart-btn" disabled={basket.length < 1}>
              {t("shop.product.checkout")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
