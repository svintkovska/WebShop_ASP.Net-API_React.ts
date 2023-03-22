﻿using System.ComponentModel.DataAnnotations.Schema;

namespace WebShop_API.Data.Entities
{
    [Table("tblOrderItems")]
    public class OrderItemEntity : BaseEntity<int>
    {
        public decimal PriceBuy { get; set; }
        public short Count { get; set; }
        [ForeignKey("Order")]
        public int OrderId { get; set; }
        public virtual OrderEntity Order { get; set; }
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public virtual ProductEntity Product { get; set; }
    }
}
