using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Constants;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Data.Entities;

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
    }

}