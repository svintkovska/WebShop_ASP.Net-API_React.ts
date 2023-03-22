using WebShop_API.Data.Entities.Identity;

namespace WebShop_API.Models
{
    public class UserItemViewModel      
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public string UserName { get; set; }
        public List <string> UserRoles { get; set; }
        public bool IsLockedOut { get; set; }
    }

    public class SelectRoleViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsSelected { get; set; }

    }
    public class EditUserViewModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Image { get; set; }
        public bool IsLockedOut { get; set; }
        public List<SelectRoleViewModel> AllRoles { get; set; }
        public List<int> SelectedRoles { get; set; }
        public DateTimeOffset? LockoutEndDate { get; set; }
    }
}
