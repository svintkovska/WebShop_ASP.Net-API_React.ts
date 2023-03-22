using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebShop_API.Abstract;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Data;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Models;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IConfiguration _configuration;
        public UsersController(UserManager<UserEntity> userManager, 
            AppEFContext appEFContext,IConfiguration configuration)
        {
            _userManager = userManager;
            _context = appEFContext;
            _configuration = configuration;
        }


        [HttpGet("users")]
        public async Task <IActionResult> GetUsers()
        {
            var users = _context.Users
               .Include(u => u.UserRoles)
               .ThenInclude(ur => ur.Role)
               .ToList();

            var roles = _context.Roles.ToList();

            List<UserItemViewModel> list = new List<UserItemViewModel>();
            foreach (var user in users)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                list.Add(new UserItemViewModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    UserRoles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow,
                    Roles = roles
                });
            }

            return Ok(list);
        }
    }
}
