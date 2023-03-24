using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X509;
using System;
using System.Text.Json.Serialization;
using WebShop_API.Data;
using WebShop_API.Data.Entities;
using WebShop_API.Models;
using WebShop_API.Services;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly IConfiguration _configuration;
        public ProductsController(AppEFContext context, IConfiguration configuration)
        {

            _context = context;
            _configuration = configuration;
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
        [HttpGet("search")]
        public IActionResult GetList([FromQuery] ProductSearchViewModel search)
        {
            var query = _context.Products.
                Include(x => x.Category)
                .Include(x => x.ProductImages)
                .AsQueryable();

            if(!string.IsNullOrEmpty(search.Name))
            {
                query = query.Where(x => x.Name.ToLower().Contains(search.Name.ToLower()));
            }
            if (!string.IsNullOrEmpty(search.Description))
            {
                query = query.Where(x => x.Description.ToLower().Contains(search.Description.ToLower()));
            }
            if (!string.IsNullOrEmpty(search.CategoryId))
            {
                int catId = int.Parse(search.CategoryId);
                query = query.Where(x => x.CategoryId == catId);
            }

            int page = search.Page;
            int pageSize = 5;

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

            var categories = _context.Categories.ToList();
            var allCategories = new List<CategoryViewModel>();
            foreach (var cat in categories)
            {
                allCategories.Add(new CategoryViewModel
                {
                    Id = cat.Id,
                    Name = cat.Name,
                });
            }
            return Ok(new ProductSearchResultViewModel
            {
                Products = list,
                Total = total,
                CurrentPage = page,
                Pages = pages,
                Categories = allCategories
            }) ;
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
            if (model.Files != null)
            {
                short priority = 1;
                foreach (var image in model.Files)
                {
                    if (image != null)
                    {
                        //imageName = await SaveImage(image);
                        imageName =  AddSizedImage.AddIFormImage(_configuration, image);
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
                 .Select(pi => "http://localhost:5285/images/300_" + pi.Name)
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
                Price = productEdit.Price,
                CategoryId = productEdit.CategoryId,
                CurrentImages = productImages,
                Categories = categoriesViewModel
            };
            return Ok(model);
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromForm] ProductEditViewModel model)
        {
            var edit = _context.Products.SingleOrDefault(x => x.Id == model.Id);
            edit.Name = model.Name;
            edit.Description = model.Description;
            edit.Price = model.Price;
            edit.CategoryId = model.CategoryId;

            string imageName = String.Empty;
            if (model.Files != null)
            {
                if(model.CurrentImages == null)
                  DeleteAllProductImages(model.Id);
                else
                {
                    var prodImages = _context.ProductImages.Where(i => i.ProductId == model.Id).ToList();
                    string[] imageSizes = ((string)_configuration.GetValue<string>("ImageSizes")).Split(" ");

                    foreach (var prodImage in prodImages)
                    {
                        foreach(var name in model.CurrentImages)
                        {
                            var path = name.Replace("http://localhost:5285/images/300_", "");
                            if (prodImage.Name != path)
                            {
                                foreach (var size in imageSizes)
                                {
                                    string dirDelProductImage = Path.Combine(Directory.GetCurrentDirectory(), "images", size + "_" + prodImage.Name);
                                    if (System.IO.File.Exists(dirDelProductImage))
                                        System.IO.File.Delete(dirDelProductImage);
                                   
                                }
                                _context.ProductImages.Remove(prodImage);
                                _context.SaveChanges();
                            }
                            
                        }
                        
                    }
                    
                }


                short priority = 1;
                foreach (var image in model.Files)
                {
                    if (image != null)
                    {
                        imageName = AddSizedImage.AddIFormImage(_configuration, image);
                        ProductImageEntity pi = new ProductImageEntity
                        {
                            Name = imageName,
                            Priority = priority,
                            ProductId = model.Id
                        };
                        _context.ProductImages.Add(pi);
                        _context.SaveChanges();
                    }
                }
            }

            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var productToDelete = _context.Products.Where(p => p.Id == id).FirstOrDefault();
            if (productToDelete == null)
                return NotFound();

            DeleteAllProductImages(id);

            _context.Products.Remove(productToDelete);

            _context.SaveChanges();
            return Ok();
        }

       private void DeleteAllProductImages(int id)
        {
            var prodImages = _context.ProductImages.Where(i => i.ProductId == id).ToList();
            string[] imageSizes = ((string)_configuration.GetValue<string>("ImageSizes")).Split(" ");

            foreach (var prodImage in prodImages)
            {
                foreach (var size in imageSizes)
                {
                    string dirDelProductImage = Path.Combine(Directory.GetCurrentDirectory(), "images", size + "_" + prodImage.Name);
                    if (System.IO.File.Exists(dirDelProductImage))
                        System.IO.File.Delete(dirDelProductImage);
                }
            }
            _context.ProductImages.RemoveRange(prodImages);
            _context.SaveChanges();
        }
    }
}
