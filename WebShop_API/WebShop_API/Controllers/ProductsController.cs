using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using WebShop_API.Data;
using WebShop_API.Data.Entities;
using WebShop_API.Models;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppEFContext _context;
        public ProductsController(AppEFContext context)
        {

            _context = context;
        }

        [HttpGet]
        public IActionResult GetList()
        {
            var list = _context.Products
                .Include(x=>x.Category)
                .Include(x => x.ProductImages)
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
            return Ok(list);
        }

        [HttpGet("create")]
        public async Task<IActionResult> Create()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductCreateViewModel model)
        {
            
            var entity = new ProductEntity
            {
                Name = model.Name,
                DateCreated = DateTime.UtcNow,
                Price = model.Price,
                CategoryId = model.CategoryId
                
            };
            _context.Products.Add(entity);
            _context.SaveChanges();

            string imageName = String.Empty;
            if(model.Files != null)
            {
                short priority = 1;
                foreach (var image in model.Files)
                {
                    if(image !=null)
                    {
                        imageName = await SaveImage(image);
                        ProductImageEntity pi = new ProductImageEntity
                        {
                            Name = imageName,
                            Priority = priority,
                            ProductId = entity.Id
                        };
                        _context.ProductImages.Add(pi);
                        _context.SaveChanges();
                    }
                }
            }

            return Ok();
        }

        [HttpGet("edit/{id}")]
        public async Task<IActionResult> Edit(int id)
        {
            var productEdit = _context.Products.SingleOrDefault(c => c.Id == id);
            var productImages = await _context.ProductImages.Where(pi => pi.ProductId == id)
                .Select(pi=>pi.Name)
                .ToListAsync();


            var categories = await _context.Categories
                .ToListAsync();
            List<CategoryViewModel> categoriesViewModel = new List<CategoryViewModel>();
            foreach (var item in categories)
            {
                categoriesViewModel.Add(new CategoryViewModel { Id = item.Id, Name = item.Name });
            }

            ProductEditViewModel model = new ProductEditViewModel()
            {
                Name = productEdit.Name,
                Description = productEdit.Description,
                Id = id,
                Price= productEdit.Price,
                CategoryId = productEdit.CategoryId,
                CurrentImages = productImages,
                Categories = categoriesViewModel
            };
            return Ok(model);
        }
       
        [HttpPut]
        public async Task<IActionResult> Edit([FromForm] EditCategoryViewModel model)
        {
            var edit = _context.Categories.SingleOrDefault(x => x.Id == model.Id);
            edit.Name = model.Name;
            edit.Description = model.Description;

            string imageName = String.Empty;
            if (model.UploadImage != null)
            {
                string exp = Path.GetExtension(model.UploadImage.FileName);
                imageName = Path.GetRandomFileName() + exp;
                string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
                using (var stream = System.IO.File.Create(dirSaveImage))
                {
                    await model.UploadImage.CopyToAsync(stream);
                }
                string oldImg = edit.Image;
                edit.Image = imageName;
                string dirDelImage = Path.Combine(Directory.GetCurrentDirectory(), "images", oldImg);
                if (System.IO.File.Exists(dirDelImage))
                    System.IO.File.Delete(dirDelImage);
            }


            _context.SaveChanges();
            return Ok();
        }




        private async Task<string> SaveImage(IFormFile image)
        {
            string exp = Path.GetExtension(image.FileName);
            var imageName = Path.GetRandomFileName() + exp;
            string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
            using (var stream = System.IO.File.Create(dirSaveImage))
            {
                await image.CopyToAsync(stream);
            }
            return imageName;
        }
    }
}
