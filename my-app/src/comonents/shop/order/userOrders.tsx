import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import http from "../../../http";
import { IAuthUser } from "../../auth/types";
import { IOrderItem, IUserOrder } from "../types";
import Accordion, { AccordionProps } from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { APP_ENV } from "../../../env";

const UserOrders = () => {
  const [orders, setOrders] = useState<Array<IUserOrder>>([]);
  const { email } = useSelector((store: any) => store.auth as IAuthUser);

  useEffect(() => {
    http
      .get<Array<IUserOrder>>(`api/shop/getUserOrders/${email}`)
      .then((resp) => {
        setOrders(resp.data);
      })
      .catch((error: any) => {
        console.log("error", error);
      });

    console.log("orders", orders);
  }, []);

  return (
    <>
      <div className="d-flex  flex-column justify-content-center align-items-center">
        <h1 className="text-light mt-3 mb-3">Order History</h1>
        {orders.map((order) => (
          <div className="accordion accordion-flush mb-3 col-6" key={order.id}   style={{ backgroundColor: "#f9ece6", border: "10px solid #f9ece6" }}>
            <div className="accordion-item" style={{backgroundColor: "#f9ece6"}}>
              <h2 className="accordion-header" id={`flush-heading-${order.id}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#flush-collapse-${order.id}`}
                  aria-expanded="false"
                  aria-controls={`flush-collapse-${order.id}`}
                >
                  <div className="d-flex flex-row justify-content-around align-items-center ">
                    <div className="me-5">#{order.id}</div>
                    <div className="me-5">{new Date(order.dateCreated).toLocaleTimeString()} {new Date(order.dateCreated).toDateString()}</div>
                    <div>Status: {order.status}</div>
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
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price ₴</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: IOrderItem, index: number) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={APP_ENV.IMAGE_PATH + "300_" + item.image}
                              alt={item.productName}
                              width="100"
                            />
                          </td>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserOrders;
