using System.ComponentModel.DataAnnotations.Schema;

namespace WebShop_API.Data.Entities
{
    [Table("tblOrderStatuses")]
    public class OrderStatusEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<OrderEntity> Orders { get; set; }

    }
}
