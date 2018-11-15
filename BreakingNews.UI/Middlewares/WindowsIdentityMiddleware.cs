using BreakingNews.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Principal;
using System.Threading.Tasks;

namespace BreakingNews.UI.Middlewares
{
    public class WindowsIdentityMiddleware
    {
        private readonly RequestDelegate _next;

        public WindowsIdentityMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(
            HttpContext context, IWindowsIdentityService windowsIdentityService)
        {
            windowsIdentityService.Invoke(
                (WindowsIdentity)context.User.Identity);
            await _next(context);
        }
    }
}
