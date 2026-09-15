using System.ComponentModel.DataAnnotations;

namespace TacoLab.Server.Application.Models
{
    public class UserLoginModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }
    public class AuthToken
    {
        public string Token { get; set; }
        public DateTime Vigencia { get; set; }
        public string Usuario { get; set; }
        public IList<string> Roles { get; set; }
        //public IEnumerable<string> Permisos { get; set; } = [];
    }

    public class ValidateRequest
    {
        public string Email { get; set; }
    }
}
