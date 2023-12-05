using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebShop_API.Abstract;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Data;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Models;
using WebShop_API.Mapper;
using AutoMapper;
using WebShop_API.Data.Entities;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public UsersController(UserManager<UserEntity> userManager, 
            AppEFContext appEFContext,IConfiguration configuration, IMapper mapper)
        {
            _userManager = userManager;
            _context = appEFContext;
            _configuration = configuration;
            _mapper = mapper;
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

        [HttpGet("search")]
        public IActionResult GetList([FromQuery] UserSearchViewModel search)
        {
            var query = _context.Users
               .Include(u => u.UserRoles)
               .ThenInclude(ur => ur.Role)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search.Email))
            {
                query = query.Where(x => x.Email.ToLower().Contains(search.Email.ToLower()));
            }
    

            int page = search.Page;
            int pageSize = 10;

            var list = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new UserItemViewModel
                {
                    Id = x.Id,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    UserName = x.UserName,
                    Email = x.Email,
                    Image = x.Image,
                    UserRoles = x.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    IsLockedOut = x.LockoutEnd.HasValue && x.LockoutEnd > DateTime.UtcNow
                })
                .ToList();

            int total = query.Count();
            int pages = (int)Math.Ceiling(total / (double)pageSize);


            return Ok(new UserSearchResultViewModel
            {
                Users = list,
                Total = total,
                CurrentPage = page,
                Pages = pages,
            });
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

        [HttpGet("allOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderStatus)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.ProductImages)
                .ToList();

            var allSatuses = _mapper.Map<List<OrderStatusViewModel>>(_context.OrderStatuses.ToList());

            var list = orders.Select(order => new UserOrderViewModel
            {
                Id = order.Id,
                Email = order.User?.Email,
                DateCreated = order.DateCreated,
                AllStatuses = allSatuses,
                Status = order.OrderStatus.Name,
                StatusId = order.OrderStatus.Id,
                Items = _mapper.Map<List<OrderItemViewModel>>(order.OrderItems)
            }).OrderByDescending(x => x.DateCreated).ToList();


            return Ok(list);
        }

        [HttpGet("searchOrders")]
        public IActionResult GetList([FromQuery] OrderSearchViewModel search)
        {
            var orders = _context.Orders
                 .Include(o => o.User)
                 .Include(o => o.OrderStatus)
                 .Include(o => o.OrderItems)
                     .ThenInclude(oi => oi.Product)
                         .ThenInclude(p => p.ProductImages)
                 .ToList();

            var allSatuses = _mapper.Map<List<OrderStatusViewModel>>(_context.OrderStatuses.ToList());

            var query = orders.Select(order => new UserOrderViewModel
            {
                Id = order.Id,
                Email = order.User?.Email,
                DateCreated = order.DateCreated,
                AllStatuses = allSatuses,
                Status = order.OrderStatus.Name,
                StatusId = order.OrderStatus.Id,
                Items = _mapper.Map<List<OrderItemViewModel>>(order.OrderItems),
                Comment = order.Comment,
                ReceiverName = order.ReceiverName,
                ReceiverPhone = order.ReceiverPhone,
                NovaPoshtaCity = order.NovaPoshtaCity,
                NovaPoshtaWarehouse = order.NovaPoshtaWarehouse,
            }).OrderByDescending(x => x.DateCreated).AsQueryable();

            if (!string.IsNullOrEmpty(search.Email))
            {
                query = query.Where(x => x.Email.ToLower().Contains(search.Email.ToLower()));
            }
            if (!string.IsNullOrEmpty(search.DateCreated))
            {
                if (DateTime.TryParse(search.DateCreated, out var date))
                {
                    query = query.Where(x => x.DateCreated.Date == date.Date);
                }
            }


            int page = search.Page;
            int pageSize = 10;

            var list = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new UserOrderViewModel
                {
                    Id = x.Id,
                    Email = x.Email,
                    DateCreated = x.DateCreated,
                    AllStatuses = allSatuses,
                    Status = x.Status,
                    StatusId = x.StatusId,
                    Items = _mapper.Map<List<OrderItemViewModel>>(x.Items),
                    Comment = x.Comment,
                    ReceiverName = x.ReceiverName,
                    ReceiverPhone = x.ReceiverPhone,
                    NovaPoshtaCity = x.NovaPoshtaCity,
                    NovaPoshtaWarehouse = x.NovaPoshtaWarehouse,
                })
                .ToList();

            int total = query.Count();
            int pages = (int)Math.Ceiling(total / (double)pageSize);


            return Ok(new OrderSearchResultViewModel
            {
                Orders = list,
                Total = total,
                CurrentPage = page,
                Pages = pages,
            });
        }

        [HttpPost("changeOrderStatus")]
        public IActionResult ChangeOrderStatus([FromBody]UserOrderViewModel model)
        {
            var order = _context.Orders.Where(x=>x.Id == model.Id).FirstOrDefault();
            order.OrderStatusId = model.StatusId;
             _context.SaveChanges();

            return Ok();
        }
    }
}
