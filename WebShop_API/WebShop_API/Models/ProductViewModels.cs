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

    public class ProductSearchViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Page { get; set; } = 1;     
        public string CategoryId { get; set; }    
    }

    public class ProductSearchResultViewModel
    {
        public List<ProductItemView> Products { get; set; }    
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
       
    }
}
