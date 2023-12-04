namespace WebShop_API.Models
{
    public class CategoryViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class CategoryItemViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
    }

    public class CategoryCreateViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
    }

    public class EditCategoryViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        public IFormFile UploadImage { get; set; }
        public string CurrentImg { get; set; }
    }

    public class CategorySearchViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Page { get; set; } = 1;
    }

    public class CategorySearchResultViewModel
    {
        public List<CategoryItemViewModel> Categories { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
        public int Total { get; set; }
    }

}
