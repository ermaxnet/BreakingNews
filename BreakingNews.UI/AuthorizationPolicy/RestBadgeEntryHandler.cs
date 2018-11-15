using BreakingNews.Domain.Constants;
using BreakingNews.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BreakingNews.UI.AuthorizationPolicy
{
    public class RestBadgeEntryHandler : AuthorizationHandler<RestBadgeEntryRequirement>
    {
        private readonly IHttpContextAccessor contextAccessor;
        private readonly string _issuer;

        public RestBadgeEntryHandler(IConfiguration configuration, IHttpContextAccessor contextAccessor)
        {
            _issuer = configuration
                .GetSection("JsonWebToken").GetValue("Issuer", string.Empty);
            this.contextAccessor = contextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RestBadgeEntryRequirement requirement)
        {
            var httpContext = contextAccessor.HttpContext;
            var user = !(httpContext.Items[GlobalConstants.TemporaryUserKey] is ClaimsPrincipal temporaryUser) ? context.User : temporaryUser;
            if (user.HasClaim(c => c.Type == RuleTypes.User && c.Issuer == _issuer) && user.HasClaim(c => c.Type == RuleTypes.ValidTo && c.Issuer == _issuer))
            {
                if (DateTime.TryParseExact(
                    user.FindFirst(c => c.Type == RuleTypes.ValidTo)?.Value, "o", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime expiresUtc) && expiresUtc > DateTime.Now)
                {
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
            }
            context.Fail();
            return Task.CompletedTask;
        }
    }
}
