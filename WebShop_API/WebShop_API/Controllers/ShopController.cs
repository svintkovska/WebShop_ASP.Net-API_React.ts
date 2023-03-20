using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Data;
using WebShop_API.Models;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly AppEFContext _context;

        public ShopController(AppEFContext context)
        {

            _context = context;
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

    }
}
