import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import http from "../../../http";
import { IAuthUser } from "../../auth/types";
import SuccessMessage from "../../common/SuccessMessage";
import { IBasket, IBasketProduct, IDeliveryInfo, IOrder } from "../types";
import { OrderSchema } from "./validation";

const MakeOrderPage = () =>{
  const [order, setOrder] = useState<IOrder>();
  const initValues: IDeliveryInfo = {
      phone: "",
      city: "",
      street: "",
      apartment: "",
      comment: "",
      payment: "",
    };

  const {basket}  = useSelector((store: any) => store.basket as IBasket);
  const {email} = useSelector((store: any) => store.auth as IAuthUser);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const navigator = useNavigate();
  useEffect(()=>{
      setOrder({
          email: email,
          items: basket
      })
  }, []);

  const onSubmitFormik = async (values: IDeliveryInfo) => {
      console.log("Fornik submit", values);
  
      http.
      post<IOrder>("api/shop/makeOrder", order)
      .then((resp) => {
          console.log("resp", resp);
          localStorage.removeItem("basket");
          setSuccessMessage(true);
          setTimeout(() => {
            navigator("/shop/userOrders");
            }, 3000);
      }).catch((error: any)=> {          
        console.log("error", error);
      });
  
      console.log("data sent", order);
    };

const formik = useFormik({
  initialValues: initValues,
  validationSchema: OrderSchema,
  onSubmit: onSubmitFormik,
});

const { values, errors, touched, handleSubmit, handleChange } = formik;

  
    return (
      <>
        <div
          className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center"
          style={{
            backgroundImage:
              "url(https://cdn.shopify.com/s/files/1/0200/7466/articles/OSA_winners_-_OOTS_Blog_Posts_1400x.png?v=1605082671",
            backgroundSize: "cover",
          }}
        >
          {" "}
          {successMessage && (
            <SuccessMessage message="Your order has been successfully placed. Expect a clarification call withing 5 minutes" />
          )}
          <div className="text-center text-info mt-4 mb-3">
            <h1>Order Details</h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="border border-info pb-2 pt-5 ps-5 pe-5"
            style={{ width: 500 }}
          >
            <div>
              <label htmlFor="phone" className="text-info mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                className={classNames("form-control", {
                  "is-invalid": touched.phone && errors.phone,
                  "is-valid": touched.phone && !errors.phone,
                })}
              />
              {touched.phone && errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
            <div>
              <label htmlFor="city" className="text-info mb-2 mt-2">
                City:
              </label>
              <select
                id="city"
                name="city"
                value={values.city}
                onChange={handleChange}
                className={classNames("form-control", {
                  "is-invalid": touched.city && errors.city,
                  "is-valid": touched.city && !errors.city,
                })}
              >
                <option value="">Select a city</option>
                <option value="Ternopil">Ternopil</option>
                <option value="Kyiv">Kyiv</option>
                <option value="Rivne">Rivne</option>
                <option value="Ivano-Frankivsk">Ivano-Frankivsk</option>
              </select>
              {touched.city && errors.city && (
                <div className="invalid-feedback">{errors.city}</div>
              )}
            </div>
            <div>
              <label htmlFor="street" className="text-info mb-2 mt-2">
                Street:
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={values.street}
                onChange={handleChange}
                className={classNames("form-control", {
                  "is-invalid": touched.street && errors.street,
                  "is-valid": touched.street && !errors.street,
                })}
              />
              {touched.street && errors.street && (
                <div className="invalid-feedback">{errors.street}</div>
              )}
            </div>
            <div>
              <label htmlFor="apartment" className="text-info mb-2 mt-2">
                Apartment:
              </label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                value={values.apartment}
                onChange={handleChange}
                className={classNames("form-control", {
                  "is-invalid": touched.apartment && errors.apartment,
                  "is-valid": touched.apartment && !errors.apartment,
                })}
              />
              {touched.apartment && errors.apartment && (
                <div className="invalid-feedback">{errors.apartment}</div>
              )}
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="comment" className="text-info mb-2 mt-2">
                Additional Comment:
              </label>
              <textarea
                id="comment"
                name="comment"
                value={values.comment}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex flex-row mt-2">
              <label className="text-info mb-2 me-3">Payment:</label>
              <div>
                <label className="text-info mb-2  me-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={values.payment === "cash"}
                    onChange={handleChange}
                  />
                  Cash
                </label>
              </div>
              <div>
                <label className="text-info mb-2">
                  <input
                    type="radio"
                    name="payment"
                    value="LIQpayment"
                    checked={values.payment === "LIQpayment"}
                    onChange={handleChange}
                  />
                  LiqPay
                </label>
                {touched.payment && errors.payment && (
                  <div className="invalid-feedback">{errors.payment}</div>
                )}
              </div>
            </div>
            <div className="text-center mt-3 mb-3">
              <button className="btn btn-info" type="submit">Make Order</button>
            </div>
          </form>
        </div>
      </>
    );
};

export default MakeOrderPage;