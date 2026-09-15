using System.Net;

namespace TacoLab.Server.Application.Models
{
    public class ApiMessageResponseModels
    {
        public string Message { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public bool Success => (int)StatusCode >= 200 && (int)StatusCode < 300;

        /// <summary>
        /// Creates an ApiResponse object with the given status code and message
        /// </summary>
        /// <param name="statusCode">HttpStatusCode of the response.</param>
        /// <param name="message">Any message for the client.</param>
        public ApiMessageResponseModels(HttpStatusCode statusCode, string message = null)
        {
            StatusCode = statusCode;
            Message = message;
        }
    }

    public class ApiResponse<T> where T : class
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public bool Success => (int)StatusCode >= 200 && (int)StatusCode < 300;

        /// <summary>
        /// Creates a simple ApiResponse object with status 200 (OK) and the given data.
        /// </summary>
        /// <param name="data">Data to be returned to the client.</param>
        public ApiResponse(T data)
        {
            StatusCode = HttpStatusCode.OK;
            Data = data;
        }

        /// <summary>
        /// Creates an ApiResponse object with the given status code and message
        /// </summary>
        /// <param name="statusCode">HttpStatusCode of the response.</param>
        /// <param name="message">Any message for the client.</param>
        public ApiResponse(HttpStatusCode statusCode, string message = null)
        {
            StatusCode = statusCode;
            Message = message;
        }

        /// <summary>
        /// Creates a ApiResponse object with the given parameters.
        /// </summary>
        /// <param name="statusCode">HttpStatusCode of the response.</param>
        /// <param name="data">Data to be returned to the client.</param>
        /// <param name="message">Any message for the client.</param>
        public ApiResponse(HttpStatusCode statusCode, T data = null, string message = null)
        {
            StatusCode = statusCode;
            Data = data;
            Message = message;
        }
    }

    public class ServiceMessageResponse
    {
        public string Message { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public bool Success => (int)StatusCode >= 200 && (int)StatusCode < 300;

        public ServiceMessageResponse(HttpStatusCode statusCode, string message = null)
        {
            StatusCode = statusCode;
            Message = message;
        }
    }
}
