using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebShop_API.Data.Entities
{
    [Table("tblCategories")]
    public class CategoryEntity : BaseEntity<int>
    {
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        [StringLength(4000)]
        public string Description { get; set; }
        [StringLength(500)]

        public string Image { get; set; }
    }
}
