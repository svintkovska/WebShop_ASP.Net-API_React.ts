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


        [HttpGet]
        public async Task <IActionResult> GetUsers()
        {
            var users = _context.Users
               .Include(u => u.UserRoles)
               .ThenInclude(ur => ur.Role)
               .ToList();

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
                    Image = user.Image,
                    UserRoles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow
                });
            }

            return Ok(list);
        }

        [HttpGet("edit/{id}")]
        public async Task<IActionResult> EditUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            var userRoles = await _userManager.GetRolesAsync(user);

            var allRoles = _context.Roles
                .Select(x => new SelectRoleViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    IsSelected = userRoles.Contains(x.Name)
                })
                .ToList();

            var model = new EditUserViewModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Image = user.Image,
                Email = user.Email,
                UserName = user.UserName,
                AllRoles = allRoles,
                SelectedRoles = allRoles.Where(x => x.IsSelected).Select(x => x.Id).ToList(),
                IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow,
                LockoutEndDate = user.LockoutEnd?.ToLocalTime()
            };

            return Ok(model);

        }

        [HttpPut]
        public async Task<ActionResult> EditUser(EditUserViewModel model)
        {

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return NotFound();
            }

            user.LockoutEnabled = model.IsLockedOut;

            if (model.IsLockedOut && model.LockoutEndDate.HasValue)
            {
                user.LockoutEnd = model.LockoutEndDate;
            }
            else
            {
                user.LockoutEnd = null;
            }


            List<string> selectedRoles = new List<string>();
            var roles = model.SelectedRoles;
            var allroles = _context.Roles;
            foreach (var role in allroles)
            {
                foreach (var selRole in roles)
                {
                    if (role.Id == selRole)
                        selectedRoles.Add(role.Name);

                }
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var addedRoles = selectedRoles.Except(userRoles);
            var result = await _userManager.AddToRolesAsync(user, addedRoles);

            if (!result.Succeeded)
            {
                BadRequest();
            }

            var removedRoles = userRoles.Except(selectedRoles);

            result = await _userManager.RemoveFromRolesAsync(user, removedRoles);


            if (!result.Succeeded)
            {
                BadRequest();

            }

            return Ok();

        }
    }
}
