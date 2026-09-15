using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Authentication;
using TacoLab.Server.Application.Models;
using TacoLab.Server.Application.Services;

namespace TacoLab.Server.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuthController : Controller
    {
        private readonly IAuthService _auhtService;
        public AuthController(IAuthService authService)
        {
            _auhtService = authService;
        }


        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthToken), 200)]
        [ProducesResponseType(typeof(ApiMessageResponseModels), 401)]
        public async Task<IActionResult> login(UserLoginModel model)
        {
            try
            {
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
                    return Unauthorized(new { message = "Método de autenticación no permitido en producción." });

                var result = await _auhtService.GetAuthTokenAsync(model);
                return Ok(result);
            }
            catch (InvalidCredentialException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor." });
            }
        }


    }
}
