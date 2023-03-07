namespace WebShop_API.Models
{
    public class GoogleLogInViewModel
    {
        public string Token { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public IFormFile Image { get; set; }
    }
}
