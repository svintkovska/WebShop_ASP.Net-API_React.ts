using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace WebShop_API.Models
{
    public class EditCategoryViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public IFormFile UploadImage { get; set; }
        public string CurrentImg { get; set; }
    }
}
