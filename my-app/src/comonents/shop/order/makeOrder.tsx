import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import http from "../../../http";
import { IAuthUser } from "../../auth/types";
import SuccessMessage from "../../common/SuccessMessage";
import { IBasket, IBasketProduct, IOrder } from "../types";

const MakeOrderPage = () =>{
    const [order, setOrder] = useState<IOrder>();
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

    console.log("items55555", order);
    
    const makeOrderHandler = ()=>{
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
        
    }

    return(
        <>
        <div>
        {successMessage && (
        <SuccessMessage message="Your order has been successfully placed. Expect a clarification call withing 5 minutes" />
      )}
            <h1>Order</h1>
            <button onClick={makeOrderHandler}>Make Order</button>
        </div>
        </>
    )
};

export default MakeOrderPage;