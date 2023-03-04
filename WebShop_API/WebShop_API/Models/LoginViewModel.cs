using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace WebShop_API.Models
{
    public class LoginViewModel
    {

        public string Email { get; set; }

        public string Password { get; set; }

        public string ReturnUrl { get; set; }
    }
}
