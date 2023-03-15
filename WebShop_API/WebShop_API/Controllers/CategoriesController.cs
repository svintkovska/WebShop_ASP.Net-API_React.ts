using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop_API.Data;
using WebShop_API.Data.Entities;
using WebShop_API.Models;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppEFContext _context;

        public CategoriesController(AppEFContext context) { 
            
            _context= context;
        }

        [HttpGet]
        public IActionResult GetList()
        {
            var list = _context.Categories
                .Select(x=> new CategoryItemViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Image= x.Image,
                    Description = x.Description,
                })
                .ToList();  
            return Ok(list);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CategoryCreateViewModel model)
        {
            string imageName = String.Empty;
            if (model.Image != null)
            {
                string exp = Path.GetExtension(model.Image.FileName);
                imageName = Path.GetRandomFileName() + exp;
                string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
                using (var stream = System.IO.File.Create(dirSaveImage))
                {
                    await model.Image.CopyToAsync(stream);
                }
            }
            var user = new CategoryEntity
            {
                Name = model.Name,
                Description = model.Description,
                Image = imageName,
            };
            _context.Categories.Add(user);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("edit/{id}")]
        public IActionResult Edit(int id)
        {
            string imageName = String.Empty;
            var userEdit = _context.Categories.SingleOrDefault(c => c.Id == id);
            imageName = userEdit.Image;
            EditCategoryViewModel model = new EditCategoryViewModel()
            {
                Name = userEdit.Name,
                Description = userEdit.Description,
                Id = id,
                CurrentImg = userEdit.Image
            };
             return Ok(model);
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromForm]EditCategoryViewModel model)
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

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var del = _context.Categories.SingleOrDefault(x => x.Id == id);
            if (del.Image != null)
            {
                string dirDelImage = Path.Combine(Directory.GetCurrentDirectory(), "images", del.Image);
                if (System.IO.File.Exists(dirDelImage))
                    System.IO.File.Delete(dirDelImage);
            }

            _context.Categories.Remove(del);
            _context.SaveChanges();
            return Ok();
        }
    }
}
