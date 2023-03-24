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
    allStatuses: IOrderStatus[]
  }