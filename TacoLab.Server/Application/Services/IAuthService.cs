using TacoLab.Server.Application.Models;

namespace TacoLab.Server.Application.Services
{
    public interface IAuthService
    {
        Task<AuthToken> GetAuthTokenAsync(UserLoginModel userModel);
    }
}
