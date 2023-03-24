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
    public class UserOrderViewModel
    {
        public int Id { get; set;}
        public DateTime DateCreated { get; set; }
        public string Status { get; set; }  
        public List<OrderItemViewModel> Items { get; set; }

    }
}
