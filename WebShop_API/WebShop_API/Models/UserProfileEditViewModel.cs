﻿namespace WebShop_API.Models
{
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
