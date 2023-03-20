namespace WebShop_API.Models
{
    public class LoginViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class GoogleLogInViewModel
    {
        public string Token { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string ImagePath { get; set; }
        public IFormFile UploadImage { get; set; }

    }
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
    public class NewPasswordViewModel
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class ForgotPasswordModel
    {
        public string Email { get; set; }
    }
    public class ChangePasswordViewModel
    {
        public string OldPassword { get; set; }

        public string NewPassword { get; set; }

        public string ConfirmPassword { get; set; }
        public string Email { get; set; }
    }

    public class UserProfileEditViewModel
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }

        public IFormFile UploadImage { get; set; }
        public string CurrentImg { get; set; }
    }
}
