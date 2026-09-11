using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using TacoLab.Server.Application.Services;
using TacoLab.Server.Application.Services.Implementations;
using TacoLab.Server.Domain.Entities;
using TacoLab.Server.Infrastructure.Data;

namespace TacoLab.Server
{
    public static class AppServices
    {
        public static void AddAppServices(this IServiceCollection services)
        {



        }
        public static void AddIdentity(this IServiceCollection services)
        {
            // Auth Services
            services.AddScoped<IAuthService, AuthService>();

            //services.AddDefaultIdentity<ApplicationUser>()
            //    .AddRoles<IdentityRole>()
            //    .AddEntityFrameworkStores<ApplicationDbContext>()
            //    .AddTokenProvider<DataProtectorTokenProvider<ApplicationUser>>("Intranet");

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromDays(31);
                options.Lockout.MaxFailedAccessAttempts = 8;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+&$%# ";
                options.User.RequireUniqueEmail = false;
            });
        }
        /// <summary>
        /// Creates the _configuration for JWT Authentication.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="config"></param>
        public static void AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
        {
            var secret = config["AppSettings:JwtSecret"];
            var key = Encoding.ASCII.GetBytes(secret);

            services.AddAuthentication(opts =>
            {
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opts =>
            {
                opts.RequireHttpsMetadata = false;
                opts.SaveToken = true;
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    NameClaimType = ClaimTypes.Name,
                    RoleClaimType = ClaimTypes.Role
                };
            });
        }


    }
}
