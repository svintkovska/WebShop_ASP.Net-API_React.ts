using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebShop_API.Constants;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Models;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly UserManager<UserEntity> _userManager;
        private readonly SignInManager<UserEntity> _signInManager;
        public AccountController(UserManager<UserEntity> userManager, SignInManager<UserEntity> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]

        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return Redirect(model.ReturnUrl);
                    }
                    else if (result.IsLockedOut)
                    {
                        var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);

                        TimeSpan remainingTime = lockoutEnd.HasValue ? lockoutEnd.Value.Subtract(DateTimeOffset.Now).Duration() : TimeSpan.Zero;
                        TimeSpan timeSpan = TimeSpan.FromSeconds(remainingTime.TotalSeconds);
                        int months = timeSpan.Days / 30;
                        int days = timeSpan.Days % 30;
                        int hours = timeSpan.Hours;
                        int minutes = timeSpan.Minutes;
                        int seconds = timeSpan.Seconds;

                        string remainingTimeStr = $"{months} months, {days} days, {hours} hours, {minutes} minutes, and {seconds} seconds";

                        ModelState.AddModelError("", $"Your account is locked out. Please try again after {remainingTimeStr}.");
                        return Ok(model);
                    }
                }
            }
            ModelState.AddModelError("", "Incorrect data");
            return Ok(model);
        }
        [HttpPost("logout")]
        public async Task<IActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm]RegisterUserViewModel model)
        {

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
                model.ImgPath = imageName;
            }

            UserEntity user = new UserEntity()
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.UserName,
                Email = model.Email,
                Image = imageName
            };

            var result = _userManager.CreateAsync(user, model.Password).Result;
            if (result.Succeeded)
            {
                result = _userManager.AddToRoleAsync(user, Roles.User).Result;
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }  
    }
}
