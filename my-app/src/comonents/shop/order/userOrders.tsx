import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import http from "../../../http";
import { IAuthUser } from "../../auth/types";
import { IOrderItem, IUserOrder } from "../types";
import Accordion, { AccordionProps } from "react-bootstrap/Accordion";
import { APP_ENV } from "../../../env";
import qs from "qs";
import { Link, useSearchParams } from "react-router-dom";
import {IOrderResult, IOrderSearch} from "../types";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';


const UserOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Array<IUserOrder>>([]);
  const { email } = useSelector((store: any) => store.auth as IAuthUser);
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<IOrderResult>({
      pages: 0,
      orders: [],
      total: 0,
      currentPage:0,
  });

  const [search, setSearch] = useState<IOrderSearch>({
      dateCreated:searchParams.get("dateCreated") || "",
      page: searchParams.get("page") || 1,
  });
  
  function filterNonNull(obj: IOrderSearch) {
      return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v));
    }

    const buttons = [];
    for (let i = 1; i <= data.pages; i++) {
      buttons.push(i);
    }

    const pagination = buttons.map((page) => (
      <li key={page} className="page-item">
        <Link
          className={classNames("page-link", { active: data.currentPage === page })}
          onClick={() => setSearch({ ...search, page })}
          to={"?" + qs.stringify(filterNonNull({ ...search, page }))}
        >
          {page}
        </Link>
      </li>
    ));

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>{
      setSearch({...search, [e.target.name]: e.target.value});
  }

  useEffect(() => {
  console.log("search", search);
        http.
            get<IOrderResult>(`api/shop/getUserOrders/${email}`, {
                params: search
            })
            .then((resp) => {
                console.log("orders list", resp.data);
                setData(resp.data);
                setOrders(resp.data.orders);
            });
        }, [search]);


  return (
    <>
      <div className="d-flex  flex-column justify-content-center align-items-center">
        <h1 className="text-light mt-3 mb-3">{t('shop.product.oderHistory')}</h1>
        <div className="d-flex flex-row justify-content-center ">
          <div className="mb-3 col-12 me-5">
            <label htmlFor="description" className="form-label d-none"></label>
            <input
              type="date"
              className="form-control"
              name="dateCreated"
              value={search.dateCreated}
              onChange={onChangeInputHandler}
              placeholder="Search by date"
            />
          </div>
        </div>
        {orders.map((order) => (
          <div
            className="accordion accordion-flush mb-3 col-6 my_accordion"
            key={order.id}
            style={{ backgroundColor: "#f9ece6", border: "10px solid #f9ece6" }}
          >
            <div
              className="accordion-item"
              style={{ backgroundColor: "#f9ece6" }}
            >
              <h2 className="accordion-header" id={`flush-heading-${order.id}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#flush-collapse-${order.id}`}
                  aria-expanded="false"
                  aria-controls={`flush-collapse-${order.id}`}
                >
                  <div className="d-flex flex-row justify-content-around align-items-center user_orders">
                    <div className="me-5">#{order.id}</div>
                    <div className="me-5">
                      {new Date(order.dateCreated).toLocaleTimeString()}{" "}
                      {new Date(order.dateCreated).toDateString()}
                    </div>
                    <div>{t('shop.product.status')}: {order.status}</div>
                  </div>
                </button>
              </h2>
              <div
                id={`flush-collapse-${order.id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`flush-heading-${order.id}`}
                data-bs-parent={`#accordionFlushExample-${order.id}`}
              >
                <div className="accordion-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>{t('shop.product.productName')}</th>
                        <th>{t('shop.product.quantity')}</th>
                        <th>{t('shop.product.price')} ₴</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: IOrderItem, index: number) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={APP_ENV.IMAGE_PATH + "300_" + item.image}
                              alt={item.productName}
                              className="accordion_img"
                            />
                          </td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <p>
                      <b>{t('shop.product.comment')}:</b> {order.comment}
                    </p>
                    <p>
                      <b>{t('shop.product.receiverInfo')}:</b> {order.receiverName},{" "}
                      {order.receiverPhone}
                    </p>
                    <div className="d-flex flex-row justify-content-center ">
                        <div className="mb-3 col-4">
                      <img
                        className="img-fluid"
                        src="https://play-lh.googleusercontent.com/JgS24PBUj_bet88K9CCLoH7QuqUBydeX9VI3XN2Ss9CmBTkHAX4Ku23kJi2YtIEyZA"
                        alt="Nova Poshta"
                        style={{ width: "80px" }}
                      />
                    </div>
                    <div className="mb-3 col-8 me-5">
                      <p>
                        {order.novaPoshtaCity}
                      </p>
                      <p>
                       {order.novaPoshtaWarehouse}
                      </p>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="d-flex flex-row justify-content-center">
          <nav>
            <ul className="pagination">{pagination}</ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default UserOrders;
