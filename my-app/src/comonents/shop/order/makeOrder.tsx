import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http";
import { IAuthUser } from "../../auth/types";
import SuccessMessage from "../../common/SuccessMessage";
import { IBasket, IBasketProduct, IDeliveryInfo, IOrder } from "../types";
import { OrderSchema } from "./validation";
import Novaposhta from "./novaPoshta_API";

const MakeOrderPage = () =>{
  const [order, setOrder] = useState<IOrder>();
  const initValues: IDeliveryInfo = {
      name: "",
      phone: "",
      novaPoshtaAddress: "",
      comment: "",
      payment: "",
    };
    const [selectedCityWarehouse, setSelectedCityWarehouse] = useState<string | null>(null);

    const handleCityWarehouseSelect = (cityWarehouse: string) => {
      setSelectedCityWarehouse(cityWarehouse);
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
        <div className="cart-card">
        {successMessage && (
            <SuccessMessage message="Your order has been successfully placed. Expect a clarification call withing 5 minutes" />
          )}
          <form className="row" onSubmit={handleSubmit}>
            <div className="col-md-8 cart">
              <div className="title">
                <div className="row">
                  <div className="col">
                    <h4>
                      <b>Delivery Information</b>
                    </h4>
                  </div>
                  <div>
                    <label htmlFor="name">Full Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      className={classNames("form-control", {
                        "is-invalid": touched.name && errors.name,
                        "is-valid": touched.name && !errors.name,
                      })}
                    />
                    {touched.name && errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                      type="phone"
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
                  <div className="d-flex flex-column">
                    <label htmlFor="novaPoshtaAddress">
                      Nova Poshta Address:
                    </label>
                    <input
                      type="text"
                      id="novaPoshtaAddress"
                      name="novaPoshtaAddress"
                      value={ values.novaPoshtaAddress = selectedCityWarehouse || ""}
                      readOnly
                      onChange={handleChange}
                      className={classNames("form-control", {
                        "is-invalid": touched.novaPoshtaAddress && errors.novaPoshtaAddress,
                        "is-valid": touched.novaPoshtaAddress && !errors.novaPoshtaAddress,
                      })}
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
                </div>
              </div>

              <div className="back-to-shop">
                <Link to="/shop/basket">
                  <a className="back-btn" style={{ padding: "10px" }}>
                    Back to Cart
                  </a>
                </Link>
              </div>
            </div>
            <div className="col-md-4 summary">
              <div>
                <h5>
                  <img
                    className="img-fluid"
                    src="https://manufactura.ua/upload/iblock/23c/23c22cc44835b59de045064cf37a1431.jpg"
                    alt="Nova Poshta"
                    style={{ width: "400px" }}
                  />
                </h5>
              </div>
              <div
                className="row"
                style={{
                  borderTop: "1px solid rgba(0,0,0,.1)",
                  padding: "2vh 0",
                }}
              >
                <div className="col text-right">
                <Novaposhta onCityWarehouseSelect={handleCityWarehouseSelect} />
                </div>
              </div>
                <button
                  type="submit"
                  className="cart-btn"
                  disabled={basket.length < 1}
                >
                  Make Order
                </button>
            </div>
          </form>
        </div>
      </>
    );
};

export default MakeOrderPage; 