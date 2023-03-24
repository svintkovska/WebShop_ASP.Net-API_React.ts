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

        public ShopController(AppEFContext context, UserManager<UserEntity> userManager)
        {

            _context = context;
            _userManager = userManager;
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
                DateCreated = DateTime.UtcNow,
                OrderStatusId = _context.OrderStatuses.Where(x=>x.Name == OrderStatuses.Pending).FirstOrDefault().Id,
            };
            // _context.Orders.Add(order);

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
        public async Task<IActionResult> GetUserOrders(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest("User Not Found");

            var orders = _context.Orders.Where(x => x.UserId == user.Id).ToList();

            var list = new List<UserOrderViewModel>();

            foreach (var order in orders)
            {
                var items = _context.OrderItems.Where(x => x.OrderId == order.Id).ToList();
                var orderItems = new List<OrderItemViewModel>();
                foreach (var item in items)
                {
                    orderItems.Add(new OrderItemViewModel
                    {
                        OrderId = item.OrderId,
                        ProductId = item.ProductId,
                        ProductName = _context.Products.Where(x => x.Id == item.ProductId).FirstOrDefault().Name,
                        Price = item.PriceBuy,
                        Quantity = item.Count,
                        Image = _context.ProductImages.Where(x => x.ProductId == item.ProductId).FirstOrDefault().Name

                    });
                }

                var model = new UserOrderViewModel()
                {
                    Id = order.Id,
                    DateCreated = order.DateCreated,
                    Status = _context.OrderStatuses.Where(x => x.Id == order.OrderStatusId).FirstOrDefault().Name,
                    Items = orderItems
                };

                list.Add(model);
            }

           

            return Ok(list);
        }

    }
}
