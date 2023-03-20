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
      }
    return state;

  }


  export const addToBasket = (basket: IBasketProduct[]) => {
    //localStorage.setItem("basket", JSON.stringify(basket));
    return {
      type: BasketActionType.ADD_TO_BASKET,
      payload: basket,
    };
  };

 