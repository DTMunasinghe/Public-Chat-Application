using ApplicationServices.Dtos;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("api/users")]
    public class UserController : Controller
    {
        private UserManager<User> _userManager { get; set; }
        private ApplicationSettings _applicationSettings { get; set; }

        public UserController(UserManager<User> userManager, IOptions<ApplicationSettings> applicationSettings)
        {
            _userManager = userManager;
            _applicationSettings = applicationSettings.Value;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto user)
        {
            var userData = new User()
            {
                UserName = user.UserName,
            };

            try
            {
                var result = await _userManager.CreateAsync(userData, user.Password);
                return Ok(result);
            } 
            catch(Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto userDto)
        {
            var user = await _userManager.FindByNameAsync(userDto.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, userDto.Password))
            {
                // create tokenDescriptor
                var tokenDescriptor = new SecurityTokenDescriptor()
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID", user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_applicationSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                //creates a security token using the tokenDescriptor.
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            } 
            else
            {
                return BadRequest("Username or password is incorrect.");
            }
        }
    }
}
