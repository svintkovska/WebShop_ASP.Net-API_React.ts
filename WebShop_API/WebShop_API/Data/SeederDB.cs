using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Constants;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Data.Entities;
using Bogus;
using WebShop_API.Helpers;
using System.Drawing.Imaging;

namespace WebShop_API.Data
{
    public static class SeederDB
    {
        public static void SeedData(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppEFContext>();

                context.Database.Migrate();

                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
                var rolemanager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();

                if (!context.Categories.Any())
                {
                    CategoryEntity cat = new CategoryEntity()
                    {
                        Name = "Pizza",
                        DateCreated = DateTime.Now,
                        Image = "pizza.jpg"
                    };
                    context.Categories.Add(cat);
                    context.SaveChanges();
                }

                if (!context.Products.Any())
                {

                    var testProduct = new Faker<ProductEntity>()
                        .RuleFor(u => u.Name, (f, u) => f.Commerce.Product())
                        .RuleFor(u => u.Price, (f, u) => decimal.Parse(f.Commerce.Price()))
                        .RuleFor(u => u.DateCreated, (f, u) => DateTime.UtcNow)
                        .RuleFor(u => u.Description, (f, u) => f.Commerce.ProductDescription())
                        .RuleFor(u => u.CategoryId, (f, u) => 1);
                    for (int i = 0; i < 20; i++)
                    {
                        var p = testProduct.Generate();
                        context.Products.Add(p);
                        context.SaveChanges();

                        var testProductImage = new Faker<ProductImageEntity>()
                       .RuleFor(u => u.DateCreated, (f, u) => DateTime.UtcNow)
                       .RuleFor(u => u.ProductId, (f, u) => p.Id)
                       .RuleFor(u => u.Name, f => f.Image.LoremFlickrUrl());

                        for (int j = 0; j < 3; j++)
                        {
                            var img = testProductImage.Generate();
                            string name = AddImage(app, img.Name);
                            img.Name = name;
                            context.ProductImages.Add(img);
                            context.SaveChanges();
                        }
                    }

                }



                if (!context.Roles.Any())
                {
                    RoleEntity admin = new RoleEntity
                    {
                        Name = Roles.Admin
                    };
                    RoleEntity user = new RoleEntity
                    {
                        Name = Roles.User
                    };

                    var result = rolemanager.CreateAsync(admin).Result;
                    result = rolemanager.CreateAsync(user).Result;
                }


                if (!context.Users.Any())
                {
                    UserEntity user = new UserEntity
                    {
                        FirstName = "Tania",
                        LastName = "Svintkovska",
                        Email = "tanyasv97@gmail.com",
                        UserName = "tanyasv",
                        Image = "admin.png"
                    };
                    var result = userManager.CreateAsync(user, "123456").Result;
                    if (result.Succeeded)
                    {
                        result = userManager.AddToRoleAsync(user, Roles.Admin).Result;
                    }
                }
            }
        }

        private static string AddImage(IApplicationBuilder app, string urlImage)
        {
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var _configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

                string fileName = String.Empty;

                if (urlImage != null)
                {
                    var bmp = ImageWorker.UrlToBitmap(urlImage);

                    fileName = Path.GetRandomFileName() + ".jpg";
                    string[] imageSizes = ((string)_configuration.GetValue<string>("ImageSizes")).Split(" ");
                    foreach (var imageSize in imageSizes)
                    {
                        int size = int.Parse(imageSize);
                        string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", $"{size}_{fileName}");

                        var saveImage = ImageWorker.CompressImage(bmp, size, size, false, false);
                        saveImage.Save(dirSaveImage, ImageFormat.Jpeg);
                    }
                    return fileName;

                }
            }
            return null;
        }
    }

}