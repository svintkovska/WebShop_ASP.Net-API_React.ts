export interface IOrderStatus{
    id: number;
    name: string;
}

export interface IOrderItem{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    image: string;
    orderId: number
  }
  
  export interface IUserOrders{
    id: number;
    email: string;
    dateCreated: Date;
    status: string;
    statusId: number;
    items: IOrderItem[];
    allStatuses: IOrderStatus[];
    receiverName: string;
    receiverPhone: string;
    comment: string;
    novaPoshtaCity: string ;
    novaPoshtaWarehouse: string;
  }

  export interface IOrderResult{
    orders: Array<IUserOrders>,
    pages: number,
    currentPage: number,
    total: number,
  
  }
  export interface IOrderSearch{
    email?: string,
    dateCreated?: string,
    page?: number | string | null
  }