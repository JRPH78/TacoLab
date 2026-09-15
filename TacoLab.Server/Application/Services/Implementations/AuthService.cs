using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using TacoLab.Server.Application.Models;
using TacoLab.Server.Domain.Entities;
using TacoLab.Server.Infrastructure.Data;

namespace TacoLab.Server.Application.Services.Implementations
{
    public class AuthService: IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;
        //private readonly ApplicationDbContext _dbContext;
        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration config
            //, ApplicationDbContext dbContext
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            //_dbContext = dbContext;
        }
        public async Task<AuthToken> GetAuthTokenAsync(UserLoginModel userModel)
        {
            // Implementation for getting authentication token
            var tokenHandler = new JwtSecurityTokenHandler();
            var appSettingsSection = _config.GetSection("AppSettings");
            var secret = appSettingsSection.GetSection("JwtSecret").Value;
            var key = Encoding.ASCII.GetBytes(secret);

            var user = await _userManager.FindByNameAsync(userModel.UserName);
            if (user == null)
                throw new InvalidCredentialException("El usuario o contraseña es invalido.");
            
            //var result = await _signInManager.CheckPasswordSignInAsync(
            //    user,
            //    userModel.Password,
            //    lockoutOnFailure: true);

            //if (!result.Succeeded)
            //{
            //    if (result.IsLockedOut)
            //        throw new InvalidCredentialException("El usuario o contraseña es invalido.");

            //    if (result.IsNotAllowed)
            //        throw new InvalidCredentialException("El usuario no tiene permitido ingresar.");

            //    throw new InvalidCredentialException("El usuario o contraseña es invalido.");
            //}

            //if (!await _signInManager.CanSignInAsync(user))
            //    throw new InvalidCredentialException("El usuario no tiene permitido ingresar.");

            //if (_userManager.SupportsUserLockout && await _userManager.IsLockedOutAsync(user))
            //    throw new InvalidCredentialException("El usuario o contraseña es invalido.");

            var roles = await _userManager.GetRolesAsync(user);
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            //claims.AddRange(permisos.Select(permiso => new Claim("permission", permiso)));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(10),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new AuthToken
            {
                Token = tokenHandler.WriteToken(token),
                Usuario = user.UserName!,
                Roles = roles,
                Vigencia = (DateTime)tokenDescriptor.Expires
            };
        }
    }
}
