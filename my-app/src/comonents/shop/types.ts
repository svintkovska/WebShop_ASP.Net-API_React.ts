export interface IBasket 
{
  basket: IBasketProduct[];
}

export interface IBasketProduct
{
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export enum BasketActionType {
    ADD_TO_BASKET = "ADD_TO_BASKET_ACTION",
    UPDATE_BASKET = "UPDATE_BASKET_ACTION",
    REMOVE_FROM_BASKET ="REMOVE_FROM_BASKET_ACTION"
  }


  export interface IOrder{

    email: string;
    receiverName: string;
    receiverPhone: string;
    comment: string;
    novaPoshtaCity: string ;
    novaPoshtaWarehouse: string;
    items: IBasketProduct[];
  }


  export interface IOrderItem{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    image: string;
    orderId: number
  }
  
  export interface IUserOrder{
    id: number;
    dateCreated: Date;
    status: string;
    items: IOrderItem[]
  }


  
  export interface IDeliveryInfo {
    receiverName: string;
    receiverPhone: string;
    comment: string;
    novaPoshtaCity: string ;
    novaPoshtaWarehouse: string;
  }