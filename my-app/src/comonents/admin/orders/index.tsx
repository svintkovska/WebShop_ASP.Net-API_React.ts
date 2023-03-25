import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import { IUserOrders } from "./types";
import { IOrderItem } from "./types";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Array<IUserOrders>>([]);
  useEffect(() => {
    http
      .get<Array<IUserOrders>>("api/users/allOrders")
      .then((resp) => {
        setOrders(resp.data);
      })
      .catch((error: any) => {
        console.log("error", error);
      });

    console.log("orders", orders);
  }, []);
  console.log("orders", orders);
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
      <div  className="cotainer vh-100 d-flex flex-column justify-content-start align-items-center">
        <h1 className="text-info mt-3">Orders</h1>
        <div className="d-flex flex-column justify-content-center align-items-center col-8">
        <table className="table ">
          <thead>
            <tr className="text-info">
              <th className="col-6 text-center">Order</th>
              <th className="col-4 ">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id }>
                <td>
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
                        <div className="d-flex flex-row justify-content-around align-items-center ">
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
                                        APP_ENV.IMAGE_PATH + "300_" + item.image
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

       
      </div>
    </>
  );
};

export default AdminOrders;
