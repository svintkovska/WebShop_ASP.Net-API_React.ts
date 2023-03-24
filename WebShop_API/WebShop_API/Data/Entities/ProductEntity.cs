﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebShop_API.Data.Entities
{
    [Table("tblProducts")]

    public class ProductEntity : BaseEntity<int>
    {
        [Required, StringLength(255)]
        public string Name { get; set; }

        public decimal Price { get; set; }
        [StringLength(4000)]
        public string Description { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public virtual CategoryEntity Category { get; set; }
        public virtual ICollection<ProductImageEntity> ProductImages { get; set; }

    }
}
