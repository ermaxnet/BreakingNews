using Microsoft.AspNetCore.Builder;
using System.Linq;
using System.Security.Principal;

namespace BreakingNews.UI.Middlewares
{
    public static class WindowsIdentityMiddlewareExtension
    {
        private static void UseWindowsIdentity(IApplicationBuilder app)
            => app.UseMiddleware<WindowsIdentityMiddleware>();

        public static IApplicationBuilder UseWhenWindowsIdentity(this IApplicationBuilder app)
            => app.UseWhen(
                context => context.User.Identities.Any(identity => identity is WindowsIdentity), UseWindowsIdentity);
    }
}
