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
import { useTranslation } from 'react-i18next';

const MakeOrderPage = () =>{
  const { t } = useTranslation();
   const [order, setOrder] = useState<IOrder>();
   const {basket}  = useSelector((store: any) => store.basket as IBasket);
   const {email} = useSelector((store: any) => store.auth as IAuthUser);
   const [successMessage, setSuccessMessage] = useState<boolean>(false);
   const [selectedCity, setSelectedCity] = useState<string | null>(null);
   const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

   const navigator = useNavigate();
   const initValues: IDeliveryInfo = {
    receiverName: "",
    receiverPhone: "",
    comment: "",
    novaPoshtaCity: "",
    novaPoshtaWarehouse: ""
    };

    const handleCitySelect = (city: string| null) => {
      setSelectedCity(city);
    };

    const handleWarehouseSelect = (warehouse: string| null) => {
      setSelectedWarehouse(warehouse);
    };
   
    
    const onSubmitFormik = async (values: IDeliveryInfo) => {

      console.log("Fornik submit", values);
      setOrder((prevOrder) => ({
        ...prevOrder,
        email: email,
        receiverName: values.receiverName,
        receiverPhone: values.receiverPhone,
        comment: values.comment,
        novaPoshtaCity: values.novaPoshtaCity,
        novaPoshtaWarehouse: values.novaPoshtaWarehouse,
        items: basket,
      }));
    console.log(order);
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
            <SuccessMessage message={t('shop.product.successOrder')} />
          )}
          <form className="row" onSubmit={handleSubmit}>
            <div className="col-md-8 cart">
              <div className="title">
                <div className="row">
                  <div className="col">
                    <h4>
                      <b>{t('shop.product.deliveryInfo')}</b>
                    </h4>
                  </div>
                  <div>
                    <label htmlFor="receiverName" style={{ color: "#e8baba", fontSize: "20px" }}>
                    {t('shop.product.receiverName')}:
                    </label>
                    <input
                      type="text"
                      id="receiverName"
                      name="receiverName"
                      value={values.receiverName}
                      onChange={handleChange}
                      className={classNames("form-control mb-2", {
                        "is-invalid":
                          touched.receiverName && errors.receiverName,
                        "is-valid":
                          touched.receiverName && !errors.receiverName,
                      })}
                    />
                    {touched.receiverName && errors.receiverName && (
                      <div className="invalid-feedback">
                        {errors.receiverName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="receiverPhone" style={{ color: "#e8baba", fontSize: "20px" }}>
                    {t('shop.product.receiverPhone')}:
                    </label>
                    <input
                      type="phone"
                      id="receiverPhone"
                      name="receiverPhone"
                      value={values.receiverPhone}
                      onChange={handleChange}
                      className={classNames("form-control mb-2", {
                        "is-invalid":
                          touched.receiverPhone && errors.receiverPhone,
                        "is-valid":
                          touched.receiverPhone && !errors.receiverPhone,
                      })}
                    />
                    {touched.receiverPhone && errors.receiverPhone && (
                      <div className="invalid-feedback">
                        {errors.receiverPhone}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-column">
                    <label
                      htmlFor="comment"
                      className=" mb-2 mt-2"
                      style={{ color: "#e8baba", fontSize: "20px" }}
                    >
                      {t('shop.product.additionalComment')}:
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      className="mb-2"
                      value={values.comment}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex flex-column">
                    <label
                      htmlFor="novaPoshtaCity"
                      style={{ color: "#e8baba", fontSize: "20px" }}
                    >
                      {t('shop.product.novaposhtaCity')}:
                    </label>
                    <input
                      type="text"
                      id="novaPoshtaCity"
                      name="novaPoshtaCity"
                      value={(values.novaPoshtaCity = selectedCity || "")}
                      onChange={handleChange}
                      readOnly
                      className={classNames("form-control mb-2", {
                        "is-invalid":
                          touched.novaPoshtaCity && errors.novaPoshtaCity,
                        "is-valid":
                          touched.novaPoshtaCity && !errors.novaPoshtaCity,
                      })}
                    />
                    {touched.novaPoshtaCity && errors.novaPoshtaCity && (
                      <div className="invalid-feedback">
                        {errors.novaPoshtaCity}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-column">
                    <label
                      htmlFor="novaPoshtaWarehouse"
                      style={{ color: "#e8baba", fontSize: "20px" }}
                    >
                      {t('shop.product.novaposhtaWarehouse')}:
                    </label>
                    <input
                      type="text"
                      id="novaPoshtaWarehouse"
                      name="novaPoshtaWarehouse"
                      value={
                        (values.novaPoshtaWarehouse = selectedWarehouse || "")
                      }
                      onChange={handleChange}
                      readOnly
                      className={classNames("form-control mb-2", {
                        "is-invalid":
                          touched.novaPoshtaWarehouse &&
                          errors.novaPoshtaWarehouse,
                        "is-valid":
                          touched.novaPoshtaWarehouse &&
                          !errors.novaPoshtaWarehouse,
                      })}
                    />
                     {touched.novaPoshtaWarehouse && errors.novaPoshtaWarehouse && (
                      <div className="invalid-feedback">
                        {errors.novaPoshtaWarehouse}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-row mt-2">
                    <label className="mb-2 me-3" style={{ color: "#e8baba" }}>*{t('shop.product.payment')}</label>
                  </div>
                </div>
              </div>

              <div className="back-to-shop">
                <Link to="/shop/basket">
                  <a className="back-btn" style={{ padding: "10px" }}>
                  {t('shop.product.backToCart')}
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
                  <Novaposhta
                    onCitySelect={handleCitySelect}
                    onWarehouseSelect={handleWarehouseSelect}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="cart-btn"
                disabled={basket.length < 1}
              >
                 {t('shop.product.makeOrder')}
              </button>
            </div>
          </form>
        </div>
      </>
    );
};

export default MakeOrderPage; 