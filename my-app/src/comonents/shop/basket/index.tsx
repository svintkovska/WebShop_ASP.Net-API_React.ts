import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_ENV } from "../../../env";
import { IBasket, IBasketProduct } from "../types";

const BasketPage = () => {
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
    <div
      className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center"
      style={{
        backgroundImage:
          "url(https://cdn.shopify.com/s/files/1/0200/7466/articles/OSA_winners_-_OOTS_Blog_Posts_1400x.png?v=1605082671",
        backgroundSize: "cover",
      }}
    >
      <div className="col-6">
        <div className="text-center text-info mt-3 mb-4">
          <h2>My Basket</h2>
        </div>

        {basket.length < 1 ? (
          <div className="text-center text-danger mt-5">
            <h1>Ooops...Your Basket is empty :(</h1>
            <Link to="/shop/categories">
            <button className="btn btn-outline-info mt-5">Start Shopping </button>
          </Link>
          </div>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center ">
            <table className="table table-striped ">
              <thead className="text-info">
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {basket.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img
                        src={APP_ENV.IMAGE_PATH + "300_" + item.image}
                        alt={item.name}
                        style={{ maxWidth: "50px", maxHeight: "50px" }}
                      />
                    </td>
                    <td style={{ color: "rgb(57, 119, 135)" }}>{item.name}</td>
                    <td style={{ color: "rgb(57, 119, 135)" }}>
                      {item.price.toFixed(2)} ₴
                    </td>
                    <td>
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
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
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => onIncreaseQuantity(item.productId)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ color: "rgb(57, 119, 135)" }}>
                      {(item.price * item.quantity).toFixed(2)} ₴
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleRemoveProduct(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}></td>
                  <td className="text-info">
                    <strong>Order Price:</strong>{" "}
                    {calculateTotalPrice().toFixed(2)} ₴
                  </td>
                  <td>
                    <Link to="/shop/makeOrder">
                      <button className="btn btn-info">Make Order</button>
                    </Link>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketPage;
