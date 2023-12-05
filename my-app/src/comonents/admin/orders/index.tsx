import classNames from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { IOrderResult, IOrderSearch, IUserOrders } from "./types";
import { IOrderItem } from "./types";
import qs from "qs";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Array<IUserOrders>>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<IOrderResult>({
      pages: 0,
      orders: [],
      total: 0,
      currentPage:0,
  });

  const [search, setSearch] = useState<IOrderSearch>({
      email: searchParams.get("email") || "",
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
            get<IOrderResult>("api/users/searchOrders", {
                params: search
            })
            .then((resp) => {
                console.log("orders list", resp.data);
                setData(resp.data);
                setOrders(resp.data.orders);
            });
        }, [search]);


  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>, order: IUserOrders ) => {
    const { name, value } = event.target;

    const newOrders = [...orders];
    const orderIndex = newOrders.findIndex((o) => o.id === order.id);

    if (orderIndex !== -1) {
      newOrders[orderIndex].statusId = Number(value);
      setOrders(newOrders);
    }
    try {
      const result = await http.post("api/users/changeOrderStatus", order);
    } catch (error: any) {
      console.log("error:", error);
    }
    console.log("Data sent", order);
  };



  return (
    <>
      <div className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
        <h1 className="text-info mt-3">Orders</h1>
        <div className="d-flex flex-row justify-content-center ">
          <div className="mb-3 col-6 me-5">
            <label htmlFor="name" className="form-label d-none"></label>
            <input
              type="text"
              className="form-control"
              name="email"
              value={search.email}
              onChange={onChangeInputHandler}
              placeholder="Search by email"
            />
          </div>
          <div className="mb-3 col-6 me-5">
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
        <div className="d-flex flex-column justify-content-center align-items-center col-8">
          <table className="table " >
            <thead>
              <tr className="text-info">
                <th className="col-6 text-center">Order</th>
                <th className="col-4 ">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{background: "black"}}>
                    <div className="accordion-item ms-5 me-5">
                      <h2
                        className="accordion-header"
                        id={`flush-heading-${order.id}`}
                      >
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#flush-collapse-${order.id}`}
                          aria-expanded="false"
                          aria-controls={`flush-collapse-${order.id}`}
                        >
                          <div className="d-flex flex-row justify-content-around align-items-center m-2">
                            <div className="me-5 text-info">#{order.id}</div>
                            <div className="me-5 text-info">{order.email}</div>
                            <div className="me-5 text-info">
                              {new Date(order.dateCreated).toLocaleTimeString()}{" "}
                              {new Date(order.dateCreated).toDateString()}
                            </div>
                          </div>
                        </button>
                      </h2>
                      <div
                        id={`flush-collapse-${order.id}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`flush-heading-${order.id}`}
                        data-bs-parent={`#accordionFlushExample-${order.id}`}
                      >
                        <div className="accordion-body bg-light">
                          <table className="table">
                            <thead>
                              <tr>
                                <th></th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price ₴</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map(
                                (item: IOrderItem, index: number) => (
                                  <tr key={index}>
                                    <td>
                                      <img
                                        src={
                                          APP_ENV.IMAGE_PATH +
                                          "300_" +
                                          item.image
                                        }
                                        alt={item.productName}
                                        width="100"
                                      />
                                    </td>
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                          <div className="d-flex flex-column justify-content-center align-items-center">
                    <p>
                      <b>Comment:</b> {order.comment}
                    </p>
                    <p>
                      <b>Receiver's Info:</b> {order.receiverName},{" "}
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
                  </td>
                  <td>
                    <div>
                      <label
                        htmlFor="statusId"
                        className="form-label d-none"
                      ></label>
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select"
                        id="statusId"
                        name="statusId"
                        value={order.statusId}
                        onChange={(event) => handleStatusChange(event, order)}
                      >
                        <option value="">Select a status</option>
                        {order.allStatuses.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-row justify-content-center">
          <nav>
            <ul className="pagination">{pagination}</ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
