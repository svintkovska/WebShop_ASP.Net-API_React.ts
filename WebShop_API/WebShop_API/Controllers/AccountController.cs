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
using WebShop_API.Services;
using Microsoft.EntityFrameworkCore;
using WebShop_API.Data;
using System.Net;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppEFContext _context;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ISmtpEmailService _emailService;
        private readonly IConfiguration _configuration;
        public AccountController(UserManager<UserEntity> userManager, IJwtTokenService jwtTokenService, 
            AppEFContext appEFContext, ISmtpEmailService emailService, IConfiguration configuration )
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _context = appEFContext;
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost("google/login")]
        public async Task<IActionResult> GoogleLogin(GoogleLogInViewModel model)
        {
            var payload = await _jwtTokenService.VerifyGoogleToken(model.Token);
            var token = "";
            if (payload == null)
            {
                return BadRequest();
            }
            string provider = "Google";
            var info = new UserLoginInfo(provider, payload.Subject, provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            bool isNewUser = false;
            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    isNewUser = true;

                    IFormFile ifile = await ConvertUrlToFormFile.ConvertUrlToIFormFile(model.ImagePath);

                    var imageName = AddSizedImage.AddIFormImage(_configuration, ifile);
                   
                    user = new UserEntity
                    {
                        Email = payload.Email,
                        UserName = payload.Email,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        Image = imageName

                    };
                    return Ok(new { isNewUser, user, token });

                }

                var resultuserLogin = await _userManager.AddLoginAsync(user, info);
                if(!resultuserLogin.Succeeded)
                {
                    return BadRequest();
                }
            }

             token = await _jwtTokenService.CreateToken(user);

            return Ok(new { isNewUser, user, token });
        }

        [HttpPost("google/registartion")]
        public async Task<IActionResult> GoogleRegistartion([FromForm]GoogleLogInViewModel model)
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
                    var imageName = "";
                    if (model.UploadImage != null)
                    {
                        imageName = AddSizedImage.AddIFormImage(_configuration, model.UploadImage);
                        model.ImagePath = imageName;
                    }
                      
                    user = new UserEntity
                    {
                        Email = payload.Email,
                        UserName = model.UserName,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        Image = model.ImagePath,

                    };
                    var resultCreate = await _userManager.CreateAsync(user);
                    if (!resultCreate.Succeeded)
                    {
                        return BadRequest();
                    }

                    await _userManager.AddToRoleAsync(user, Roles.User);

                    return Ok();

                }             
            }
   
            return BadRequest();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {

            var user = await _userManager.FindByEmailAsync(model.Email);
            //var user = await _userManager.Users
             //.Include(u => u.UserRoles)
             //.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user != null)
            {
               
                var isPasswordValid = await _userManager.CheckPasswordAsync(user, model.Password);
                if(!isPasswordValid)
                {
                    return BadRequest("Invalid password");

                }
               // var result = _userManager.AddToRoleAsync(user, Roles.User).Result;

                var roles = await _userManager.GetRolesAsync(user);

                var token = _jwtTokenService.CreateToken(user);
                return Ok(new { token, user, roles });

            }

            return BadRequest("User Not Found");
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm]RegisterUserViewModel model)
        {

            string imageName = String.Empty;
            if (model.UploadImage != null)
            {
                imageName = AddSizedImage.AddIFormImage(_configuration, model.UploadImage);         
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

        [HttpGet("edit/{email}")]
        public async Task <IActionResult> Edit(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                UserProfileEditViewModel model = new UserProfileEditViewModel()
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    CurrentImg = user.Image,
                    Email = user.Email,
                };
                return Ok(model);
            }

            return BadRequest("User Not Found");
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromForm] UserProfileEditViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;

            string imageName = String.Empty;
            if (model.UploadImage != null)
            {
                imageName = AddSizedImage.AddIFormImage(_configuration, model.UploadImage);

                string oldImg = user.Image;
                user.Image = imageName;
                string[] imageSizes = ((string)_configuration.GetValue<string>("ImageSizes")).Split(" ");

                foreach (var size in imageSizes)
                {
                    string dirDelImage = Path.Combine(Directory.GetCurrentDirectory(), "images", size + "_" + oldImg);
                    if (System.IO.File.Exists(dirDelImage))
                        System.IO.File.Delete(dirDelImage);
                }
               
            }


            _context.SaveChanges();
            return Ok(user.Image);
        }

        [HttpPost("edit/changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest();
            }

            if(model.NewPassword == model.ConfirmPassword)
            {
                var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
                return Ok();

            }
            return BadRequest();
        }

        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword( ForgotPasswordModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return NotFound();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var frontendURL = _configuration.GetValue<string>("FrontEndURL");
            var callbackURL = $"{frontendURL}/resetpassword?userId={user.Id}&" + $"code={WebUtility.UrlEncode(token)}";

            var message = new Message()
            {
                To = user.Email,
                Subject = "Reset Password",
                Body = "To reset the password follow the link -> " + $"<a href='{callbackURL}'> Reset Password </a>"
            };
            _emailService.Send(message);
        
            return Ok();
        }

        [HttpPost("newPassword")]
        public async Task<IActionResult> ChangePassword([FromBody] NewPasswordViewModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            var res = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if(!res.Succeeded)
            {
                return BadRequest();
            }
            return Ok();
        }

    }





}
