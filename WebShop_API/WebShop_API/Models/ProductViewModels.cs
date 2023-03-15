using WebShop_API.Data.Entities;

namespace WebShop_API.Models
{
    public class ProductItemView
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public List<string> Images { get; set; }
    }

    public class ProductCreateViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public List<IFormFile> Files { get; set; }
    }

    public class ProductEditViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public List<CategoryViewModel> Categories { get; set; }

        public List<string> CurrentImages { get; set; }

        public List<IFormFile> Files { get; set; }

    }
}
