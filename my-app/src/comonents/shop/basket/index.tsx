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
    // <div
    //   className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center"
    //   style={{
    //     backgroundImage:
    //       "url(https://cdn.shopify.com/s/files/1/0200/7466/articles/OSA_winners_-_OOTS_Blog_Posts_1400x.png?v=1605082671",
    //     backgroundSize: "cover",
    //   }}
    // >
    //   <div className="col-6">
    //     <div className="text-center text-info mt-3 mb-4">
    //       <h2>My Basket</h2>
    //     </div>

    //     {basket.length < 1 ? (
    //       <div className="text-center text-danger mt-5">
    //         <h1>Ooops...Your Basket is empty :(</h1>
    //         <Link to="/shop/categories">
    //         <button className="btn btn-outline-info mt-5">Start Shopping </button>
    //       </Link>
    //       </div>
    //     ) : (
    //       <div className="d-flex flex-column justify-content-center align-items-center ">
    //         <table className="table table-striped ">
    //           <thead className="text-info">
    //             <tr>
    //               <th scope="col">Image</th>
    //               <th scope="col">Name</th>
    //               <th scope="col">Price</th>
    //               <th scope="col">Quantity</th>
    //               <th scope="col">Total</th>
    //               <th scope="col"></th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {basket.map((item) => (
    //               <tr key={item.productId}>
    //                 <td>
    //                   <img
    //                     src={APP_ENV.IMAGE_PATH + "300_" + item.image}
    //                     alt={item.name}
    //                     style={{ maxWidth: "50px", maxHeight: "50px" }}
    //                   />
    //                 </td>
    //                 <td style={{ color: "rgb(57, 119, 135)" }}>{item.name}</td>
    //                 <td style={{ color: "rgb(57, 119, 135)" }}>
    //                   {item.price.toFixed(2)} ₴
    //                 </td>
    //                 <td>
    //                   <div className="input-group">
    //                     <button
    //                       className="btn btn-outline-secondary"
    //                       type="button"
    //                       onClick={() => onDecreaseQuantity(item.productId)}
    //                     >
    //                       -
    //                     </button>
    //                     <input
    //                       type="number"
    //                       className="form-control"
    //                       value={item.quantity}
    //                       style={{ maxWidth: "70px", minWidth: "50px" }}
    //                       readOnly
    //                     />
    //                     <button
    //                       className="btn btn-outline-secondary"
    //                       type="button"
    //                       onClick={() => onIncreaseQuantity(item.productId)}
    //                     >
    //                       +
    //                     </button>
    //                   </div>
    //                 </td>
    //                 <td style={{ color: "rgb(57, 119, 135)" }}>
    //                   {(item.price * item.quantity).toFixed(2)} ₴
    //                 </td>
    //                 <td>
    //                   <button
    //                     className="btn btn-outline-danger"
    //                     onClick={() => handleRemoveProduct(item.productId)}
    //                   >
    //                     Remove
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //           <tfoot>
    //             <tr>
    //               <td colSpan={4}></td>
    //               <td className="text-info">
    //                 <strong>Order Price:</strong>{" "}
    //                 {calculateTotalPrice().toFixed(2)} ₴
    //               </td>
    //               <td>
    //                 <Link to="/shop/makeOrder">
    //                   <button className="btn btn-info">Make Order</button>
    //                 </Link>
    //               </td>
    //             </tr>
    //           </tfoot>
    //         </table>
    //       </div>
    //     )}
    //   </div>
    // </div>

    <div className="cart-card">
      <div className="row">
        <div className="col-md-8 cart">
          <div className="title">
            <div className="row">
              <div className="col">
                <h4>
                  <b>Shopping Cart</b>
                </h4>
              </div>
              <div className="col align-self-center text-right text-muted">
                Your items
              </div>
            </div>
          </div>
          {basket.length < 1 ? (
            <div className="text-center text-danger mt-5">
              <h1>Ooops...Your cart is empty :(</h1>       
            </div>
          ) : (
            <section>
              {basket.map((item) => (
                <div className="row border-top border-bottom">
                  <div
                    className="row main align-items-center"
                    key={item.productId}
                  >
                    <div className="col-2">
                      <img
                        className="img-fluid"
                        src={APP_ENV.IMAGE_PATH + "300_" + item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="col">
                      <div className="row">{item.name}</div>
                    </div>
                    <div className="col">
                    <div className="input-group">
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
                    <div className="col">
                      {(item.price * item.quantity).toFixed(2)} ₴{" "}
                     
                    </div>
                    <div className="col">
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
                <a className="back-btn" style={{padding: "10px"}}>
                Back to shop
                </a>
              </Link>
            {/* <a href="#">&leftarrow;</a>
            <span className="text-muted">Back to shop</span> */}
          </div>
        </div>
        <div className="col-md-4 summary">
          <div>
            <h5>
              <b>Summary</b>
            </h5>
          </div>
          <div
            className="row"
            style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "2vh 0" }}
          >
            <div className="col">TOTAL PRICE</div>
            <div className="col text-right">
              &euro; {calculateTotalPrice().toFixed(2)} ₴
            </div>
          </div>
          <Link to="/shop/makeOrder">
          <button className="cart-btn" disabled={basket.length < 1}>CHECKOUT</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
