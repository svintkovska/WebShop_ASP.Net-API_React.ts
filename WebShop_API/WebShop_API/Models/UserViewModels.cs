using WebShop_API.Data.Entities.Identity;

namespace WebShop_API.Models
{
    public class UserItemViewModel      
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public List <string> UserRoles { get; set; }
        public List<RoleEntity> Roles { get; set; }
        public bool IsLockedOut { get; set; }
    }
}
