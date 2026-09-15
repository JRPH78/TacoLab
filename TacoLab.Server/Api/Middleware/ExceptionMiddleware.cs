//using Intranet.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Reflection;
using System.Security.Authentication;
using System.Text.Json;
using TacoLab.Server.Application.Models;

namespace TacoLab.Server.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (ArgumentException ex)
            {
                await SendResponseAsync(HttpStatusCode.BadRequest, ex.Message, httpContext);
            }
            catch (InvalidCredentialException ex)
            {
                await SendResponseAsync(HttpStatusCode.Unauthorized, ex.Message, httpContext);
            }
            catch (InvalidOperationException ex)
            {
                await SendResponseAsync(HttpStatusCode.Forbidden, ex.Message, httpContext);
            }
            catch (NullReferenceException ex)
            {
                await SendResponseAsync(HttpStatusCode.NotFound, ex.Message, httpContext);
            }
            catch (AmbiguousMatchException ex)
            {
                await SendResponseAsync(HttpStatusCode.Conflict, ex.Message, httpContext);
            }
            catch (DbUpdateException ex)
            {
                await SendResponseAsync(HttpStatusCode.InternalServerError, ex.Message, httpContext);
            }
            catch (Exception ex)
            {
                await SendResponseAsync(HttpStatusCode.InternalServerError, ex.Message, httpContext);
            }
        }

        private async Task SendResponseAsync(HttpStatusCode statusCode, string message, HttpContext httpContext)
        {
            var response = new ApiMessageResponseModels(statusCode, message);
            httpContext.Response.StatusCode = (int)statusCode;

            await httpContext.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            }));
        }
    }
}
