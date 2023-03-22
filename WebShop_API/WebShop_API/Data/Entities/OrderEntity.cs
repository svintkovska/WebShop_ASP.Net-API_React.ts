using System.ComponentModel.DataAnnotations.Schema;
using WebShop_API.Data.Entities.Identity;

namespace WebShop_API.Data.Entities
{
    [Table("tblOrders")]
    public class OrderEntity : BaseEntity<int>
    {
        [ForeignKey("OrderStatus")]
        public int OrderStatusId { get; set; }
        public virtual OrderStatusEntity OrderStatus { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public virtual UserEntity User { get; set; }
        public virtual ICollection<OrderItemEntity> OrderItems { get; set; }
    }
}
