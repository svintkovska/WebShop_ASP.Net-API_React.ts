using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using WebShop_API.Abstract;
using WebShop_API.Data;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Services;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddDbContext<AppEFContext>(opt =>
         opt.UseNpgsql(builder.Configuration.GetConnectionString("MyDbConnection")));

// Rest of your existing code


builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.Stores.MaxLengthForKeys = 128;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
}).AddEntityFrameworkStores<AppEFContext>().AddDefaultTokenProviders();



builder.Services.AddScoped<IJwtTokenService, JwtTokenService>(); 




builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(); 


var app = builder.Build();

app.UseCors(options =>
                options.AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader());
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var dir = Path.Combine(Directory.GetCurrentDirectory(), "images");
if(!Directory.Exists(dir))
{
    Directory.CreateDirectory(dir);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(dir),
    RequestPath = "/images"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.SeedData();

app.Run();
