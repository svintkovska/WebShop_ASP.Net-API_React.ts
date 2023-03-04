using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace WebShop_API.Models
{
    public class RegisterUserViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
        public IFormFile UploadImage { get; set; }
        public string ImgPath { get; set; }
    }
}
