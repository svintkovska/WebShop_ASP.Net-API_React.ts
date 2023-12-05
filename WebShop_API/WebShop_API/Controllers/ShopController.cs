using AutoMapper;
using MailKit.Search;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Constants;
using WebShop_API.Data;
using WebShop_API.Data.Entities;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Models;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IMapper _mapper;

        public ShopController(AppEFContext context, UserManager<UserEntity> userManager, IMapper mapper)
        {

            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("products/{categoryid}")]
        public IActionResult GetProductsByCategory([FromQuery] ProductSearchViewModel search)
        {
            var query = _context.Products.
                Include(x => x.Category)
                .Include(x => x.ProductImages)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search.CategoryId))
            {
                int catId = int.Parse(search.CategoryId);
                query = query.Where(x => x.CategoryId == catId);
            }

            if (!string.IsNullOrEmpty(search.Name))
            {
                query = query.Where(x => x.Name.ToLower().Contains(search.Name.ToLower()));
            }
            if (!string.IsNullOrEmpty(search.Description))
            {
                query = query.Where(x => x.Description.ToLower().Contains(search.Description.ToLower()));
            }



            int page = search.Page;
            int pageSize = 6;

            var list = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ProductItemView
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    Price = x.Price,
                    Category = x.Category.Name,
                    Images = x.ProductImages.Select(x => x.Name).ToList()
                })
                .ToList();

            int total = query.Count();
            int pages = (int)Math.Ceiling(total / (double)pageSize);


            return Ok(new ProductSearchResultViewModel
            {
                Products = list,
                Total = total,
                CurrentPage = page,
                Pages = pages
            });
        }

        [HttpGet("productItem/{productid}")]
        public IActionResult GetProductItem(int productid)
        {
            var product = _context.Products
                .Include(x => x.ProductImages)
                .Include(x => x.Category)
                .Where(x => x.Id == productid)
                .FirstOrDefault();


            if (product == null)
                return NotFound();


            ProductItemView prod = new ProductItemView()
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Images = product.ProductImages.Select(x => x.Name).ToList()
            };
            return Ok(prod);
        }


        [HttpPost("makeOrder")]
        
        public async Task<IActionResult> MakeOrder([FromBody] OrderViewModel model )
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest("User Not Found");

            var order = new OrderEntity()
            {
                UserId = user.Id,
                ReceiverName= model.ReceiverName,
                ReceiverPhone= model.ReceiverPhone,
                Comment= model.Comment,
                NovaPoshtaCity=model.NovaPoshtaCity,
                NovaPoshtaWarehouse =model.NovaPoshtaWarehouse,
                DateCreated = DateTime.UtcNow,
                OrderStatusId = _context.OrderStatuses.Where(x=>x.Name == OrderStatuses.Pending).FirstOrDefault().Id,
            };

            await _context.Set<OrderEntity>().AddAsync(order);
            await _context.SaveChangesAsync();



            var basketItems = model.Items;
            foreach (var item in basketItems)
            {
                var orderItem = new OrderItemEntity()
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    PriceBuy = item.Price,
                    Count = item.Quantity
                };

                await _context.Set<OrderItemEntity>().AddAsync(orderItem);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
      
        
        [HttpGet("getUserOrders/{email}")]
        public async Task<IActionResult> GetUserOrders(string email, [FromQuery] OrderSearchViewModel search)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest("User Not Found");


            var orders = _context.Orders
                 .Where(x => x.UserId == user.Id)
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
            int pageSize = 5;

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
                    Comment= x.Comment,
                    ReceiverName= x.ReceiverName,
                    ReceiverPhone= x.ReceiverPhone,
                    NovaPoshtaCity= x.NovaPoshtaCity,
                    NovaPoshtaWarehouse  = x.NovaPoshtaWarehouse,
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

    }
}
