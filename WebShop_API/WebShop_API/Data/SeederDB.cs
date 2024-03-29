﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Constants;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Data.Entities;
using Bogus;
using WebShop_API.Helpers;
using System.Drawing.Imaging;
using WebShop_API.Abstract;
using WebShop_API.Models;
using WebShop_API.Services;
using Bogus.DataSets;

namespace WebShop_API.Data
{
    public static class SeederDB
    {
        public static void SeedData(this IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppEFContext>();
                var emailService = scope.ServiceProvider.GetRequiredService<ISmtpEmailService>();

                context.Database.Migrate();

                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
                var rolemanager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
                var faker = new Faker();

                if (!context.Categories.Any())
                {

                    CategoryEntity cat = new CategoryEntity()
                    {
                        Name = "Cats",
                        DateCreated = DateTime.UtcNow,
                        Image = AddSizedImage.AddImage(app, faker.Image.LoremFlickrUrl())
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
                            string name = AddSizedImage.AddImage(app, img.Name);
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
                        Email = "tanyasv@gmail.com",
                        UserName = "tanyasv",
                        Image = AddSizedImage.AddImage(app, faker.Image.LoremFlickrUrl())
                    };
                    var result = userManager.CreateAsync(user, "123456").Result;
                    if (result.Succeeded)
                    {
                        result = userManager.AddToRoleAsync(user, Roles.Admin).Result;
                    }
                }
                if (!context.OrderStatuses.Any())
                {
                    OrderStatusEntity pending = new OrderStatusEntity
                    {
                        Name = OrderStatuses.Pending
                    };
                    OrderStatusEntity processing = new OrderStatusEntity
                    {
                        Name = OrderStatuses.Processing
                    };
                    OrderStatusEntity shipped = new OrderStatusEntity
                    {
                        Name = OrderStatuses.Shipped
                    };
                    OrderStatusEntity delivered = new OrderStatusEntity
                    {
                        Name = OrderStatuses.Delivered
                    };
                    OrderStatusEntity canceled = new OrderStatusEntity
                    {
                        Name = OrderStatuses.Canceled
                    };
                    OrderStatusEntity refunded = new OrderStatusEntity
                    {
                        Name = OrderStatuses.Refunded
                    };

                    context.OrderStatuses.Add(pending);
                    context.OrderStatuses.Add(processing);
                    context.OrderStatuses.Add(shipped);
                    context.OrderStatuses.Add(delivered);
                    context.OrderStatuses.Add(canceled);
                    context.OrderStatuses.Add(refunded);
                    context.SaveChanges();
                }

            }
        }     
    }
}