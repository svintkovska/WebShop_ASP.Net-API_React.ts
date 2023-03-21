export interface IBasket 
{
  basket: IBasketProduct[];
}

export interface IBasketProduct
{
    id: number;
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

