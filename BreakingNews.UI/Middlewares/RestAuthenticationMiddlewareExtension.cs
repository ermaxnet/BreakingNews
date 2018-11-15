using Microsoft.AspNetCore.Builder;

namespace BreakingNews.UI.Middlewares
{
    public static class RestAuthenticationMiddlewareExtension
    {
        public static IApplicationBuilder UseRestAuthentication(this IApplicationBuilder app)
            => app.UseMiddleware<RestAuthenticationMiddleware>();
    }
}
