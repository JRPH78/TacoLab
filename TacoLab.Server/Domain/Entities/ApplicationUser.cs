using Microsoft.AspNetCore.Identity;

namespace TacoLab.Server.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string NombreCompleto { get; set; } = string.Empty;
        public string Puesto { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;
    }
}
