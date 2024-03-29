﻿using WebShop_API.Data.Entities;

namespace WebShop_API.Models
{
    public class BasketItemViewModel
    {
        public int ProductId { get; set; }
        public short Quantity { get; set; }
        public decimal Price { get; set; }
        public int OrderId { get; set; }
    }

    public class OrderViewModel
    {
        public string Email { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string Comment { get; set; }
        public string NovaPoshtaCity { get; set; }
        public string NovaPoshtaWarehouse { get; set; }

        public List<BasketItemViewModel> Items { get; set; }
    }

    public class OrderItemViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public short Quantity { get; set; }
        public decimal Price { get; set; }
        public string Image  { get; set; }
        public int OrderId { get; set; }
    }

    public class OrderStatusViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class UserOrderViewModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public DateTime DateCreated { get; set; }
        public string Status { get; set; }  
        public int StatusId { get; set; }  
        public List<OrderItemViewModel> Items { get; set; }
        public List<OrderStatusViewModel> AllStatuses { get; set; }

        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public string Comment { get; set; }
        public string NovaPoshtaCity { get; set; }
        public string NovaPoshtaWarehouse { get; set; }

    }


    public class OrderSearchViewModel
    {
        public string Email { get; set; }
        public string DateCreated { get; set; }
        public int Page { get; set; } = 1;
    }

    public class OrderSearchResultViewModel
    {
        public List<UserOrderViewModel> Orders { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }
}
