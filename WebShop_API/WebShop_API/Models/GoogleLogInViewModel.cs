namespace WebShop_API.Models
{
    public class GoogleLogInViewModel
    {
        public string Token { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string ImagePath { get; set; }
        public IFormFile UploadImage { get; set; }

    }
}
