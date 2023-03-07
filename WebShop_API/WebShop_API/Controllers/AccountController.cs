using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebShop_API.Constants;
using WebShop_API.Data.Entities.Identity;
using WebShop_API.Models;
using Newtonsoft.Json.Linq;
using WebShop_API.Abstract;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http.HttpResults;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly UserManager<UserEntity> _userManager;
        private readonly SignInManager<UserEntity> _signInManager;
        private readonly IConfiguration _config;
        private readonly IJwtTokenService _jwtTokenService;

        public AccountController(UserManager<UserEntity> userManager, SignInManager<UserEntity> signInManager, IJwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("google/login")]
        public async Task<IActionResult> GoogleLogin([FromForm]GoogleLogInViewModel model)
        {
            var payload = await _jwtTokenService.VerifyGoogleToken(model.Token);
            if (payload == null)
            {
                return BadRequest();
            }
            string provider = "Google";
            var info = new UserLoginInfo(provider, payload.Subject, provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    string exp = Path.GetExtension(model.Image.FileName);
                    var imageName = Path.GetRandomFileName() + exp;
                    string dirSaveImage = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
                    using (var stream = System.IO.File.Create(dirSaveImage))
                    {
                        await model.Image.CopyToAsync(stream);
                    }

                    user = new UserEntity
                    {
                        Email = payload.Email,
                        UserName = payload.Email.Trim(),
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        Image = imageName

                    };
                    var resultCreate = await _userManager.CreateAsync(user);
                    if(!resultCreate.Succeeded)
                    {
                        return BadRequest();
                    }

                    await _userManager.AddToRoleAsync(user, Roles.User);

                }

                var resultuserLogin = await _userManager.AddLoginAsync(user, info);
                if(!resultuserLogin.Succeeded)
                {
                    return BadRequest();
                }
            }

            var token = _jwtTokenService.CreateToken(user);

            return Ok(new { token});
        }




        [HttpPost("login")]

        public async Task<IActionResult> Login(LoginViewModel model)
        {

                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
                    if (result.Succeeded)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return Ok();
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
                        return BadRequest($"Your account is locked out. Please try again after {remainingTimeStr}.");

                    }
                }

            return BadRequest();
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
