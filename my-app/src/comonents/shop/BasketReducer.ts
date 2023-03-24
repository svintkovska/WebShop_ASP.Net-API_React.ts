import { BasketActionType, IBasket, IBasketProduct } from "./types";

const initState: IBasket = {
    basket: []
  };

  const basket = localStorage.getItem("basket");
  if (basket) {
    initState.basket = JSON.parse(basket);
  }

  
  export const BasketReducer = (state = initState, action: any)=>{

    switch (action.type) {
        
          case BasketActionType.ADD_TO_BASKET:
          return {
            ...state,
            basket: action.payload,
          };
          case "REMOVE_FROM_BASKET":
            return {
              ...state,
              basket: state.basket.filter((item) => item.productId !== action.payload),
            };
          case "UPDATE_BASKET":
            return {
              ...state,
              basket: state.basket.map((item) =>
                item.productId === action.payload.productId ? action.payload : item
              ),
            };
          default:
            return state;

  }
}


  export const addToBasket = (basket: IBasketProduct[]) => {
    return {
      type: BasketActionType.ADD_TO_BASKET,
      payload: basket,
    };
  };
  
