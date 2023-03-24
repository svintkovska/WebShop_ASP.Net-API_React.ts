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
        post<IOrder>("api/shop/makeOrder", values)
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
        <div className="bg-light">
          {successMessage && (
            <SuccessMessage message="Your order has been successfully placed. Expect a clarification call withing 5 minutes" />
          )}
          <h1>Order</h1>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                className={classNames("form-control", {
                    "is-invalid": touched.phone && errors.phone,
                    "is-valid": touched.phone&& !errors.phone,
                  })}
              />
              {touched.phone && errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
            <div>
              <label htmlFor="city">City:</label>
              <select
                id="city"
                name="city"
                value={values.city}
                onChange={handleChange}
                className={classNames("form-control", {
                    "is-invalid": touched.city && errors.city,
                    "is-valid": touched.city&& !errors.city,
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
              <label htmlFor="street">Street:</label>
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
              <label htmlFor="apartment">Apartment:</label>
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
            <div>
              <label htmlFor="comment">Additional Comment:</label>
              <textarea
                id="comment"
                name="comment"
                value={values.comment}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Payment:</label>
              <div>
                <label>
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
                <label>
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

            <button type="submit">Make Order</button>
          </form>
        </div>
      </>
    );
};

export default MakeOrderPage;