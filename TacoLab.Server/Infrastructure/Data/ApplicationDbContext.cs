using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TacoLab.Server.Domain.Entities;

namespace TacoLab.Server.Infrastructure.Data
{
    public class ApplicationDbContext: IdentityDbContext<ApplicationUser>
    {
        //private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
             //IPasswordHasher<ApplicationUser> passwordHasher

        ) : base(options)
        {
            //_passwordHasher = passwordHasher;

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            AddRole(builder);
            AddAdministrator(builder);
        }
        #region Seeder
        private void AddRole(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(new IdentityRole { Id = "1", Name = "Administrador", NormalizedName = "ADMINISTRADOR",ConcurrencyStamp = "0452997b-0641-4f13-b811-f72dadc4b333"
            });

        }
        private void AddAdministrator(ModelBuilder modelBuilder)
        {
            var user = new ApplicationUser
            {
                Id = "99999999",

                UserName = "Administrador",
                NormalizedUserName = "ADMINISTRADOR",

                Email = "se.dev06@pcolorada.com",
                NormalizedEmail = "SE.DEV06@PCOLORADA.COM",
                EmailConfirmed = true,

                NombreCompleto = "Administrador",
                Puesto = "Administrador Intranet",
                Tipo = "Interno",
                Activo = true,
                 
                //$Admin12345
                PasswordHash = "AQAAAAIAAYagAAAAELovu4IKaw9K6rsFrYy6xbtMh6skWWknWbSgWjF8wRZI/kanL1GbjKVQM5KnOgFXYQ==",


                SecurityStamp = "1dc67424-0fdd-4e90-a696-799f7a4f2127",
                ConcurrencyStamp = "76b039c2-3b9a-4947-9abc-dd2a37c6f34b",

                LockoutEnabled = false,
                TwoFactorEnabled = false,
                PhoneNumberConfirmed = false,
                AccessFailedCount = 0
            };
            modelBuilder.Entity<ApplicationUser>().HasData(user);
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = "1",
                UserId = "99999999",

            });
        }
        #endregion

    }
}
