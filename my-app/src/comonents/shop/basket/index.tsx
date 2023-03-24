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
    localStorage.setItem('basket', JSON.stringify(updatedBasket));

  };
  
  const onDecreaseQuantity = (productId: number) => {
    const updatedProduct = basket.find((item) => item.productId === productId);
  if (updatedProduct) {
    const updatedQuantity = updatedProduct.quantity - 1;
    if (updatedQuantity > 0) {
      const updatedBasketProduct = { ...updatedProduct, quantity: updatedQuantity };
      dispatch({ type: "UPDATE_BASKET", payload: updatedBasketProduct });
      const updatedBasket = basket.map((item) => item.productId === productId ? updatedBasketProduct : item);
      localStorage.setItem('basket', JSON.stringify(updatedBasket));
    } else {
      dispatch({ type: "REMOVE_FROM_BASKET", payload: productId });
      const updatedBasket = basket.filter((item) => item.productId !== productId);
      localStorage.setItem('basket', JSON.stringify(updatedBasket));
    }
  }

  };

  const onIncreaseQuantity = (productId: number) => {
    const updatedProduct = basket.find((item) => item.productId === productId);
    if (updatedProduct) {
      const updatedQuantity = updatedProduct.quantity + 1;
      const updatedBasketProduct = { ...updatedProduct, quantity: updatedQuantity };
      dispatch({ type: "UPDATE_BASKET", payload: updatedBasketProduct });
      const updatedBasket = basket.map((item) => item.productId === productId ? updatedBasketProduct : item);
      localStorage.setItem('basket', JSON.stringify(updatedBasket));
    }
}
  return (
    <div className="container mt-5">
      <h2>My Basket</h2>
      <table className="table table-striped">
        <thead>
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
              <td>{item.name}</td>
              <td>{(item.price).toFixed(2)} ₴</td>
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
              <td>{(item.price * item.quantity).toFixed(2)} ₴</td>
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
            <td>
              <strong>Order Price:</strong> {(calculateTotalPrice()).toFixed(2)} ₴
            </td>
            <td>
              <Link to="/shop/makeOrder">
              <button className="btn btn-primary">Create Order</button>
              </Link>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BasketPage;
