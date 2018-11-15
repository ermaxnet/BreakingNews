using BreakingNews.Application.Authentication.Queries;
using BreakingNews.Application.Interfaces;
using BreakingNews.Domain.Constants;
using BreakingNews.Domain.Enums;
using BreakingNews.Domain.Exceptions;
using BreakingNews.Domain.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BreakingNews.UI.Middlewares
{
    public class RestAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IJsonWebTokenService _jsonWebTokenService;

        public RestAuthenticationMiddleware(
            RequestDelegate next,
            IJsonWebTokenService jsonWebTokenService)
        {
            _next = next;
            _jsonWebTokenService = jsonWebTokenService;
        }

        public async Task InvokeAsync(
            HttpContext context, 
            IWindowsIdentityService windowsIdentityService,
            IMediator mediator)
        {
            if (!context.User.HasClaim(claim => claim.Type == RuleTypes.User)
                && windowsIdentityService.Identity != null)
            {
                try
                {
                    var token = await mediator.Send(
                    new AuthenticateOnRestServiceQuery
                    {
                        TemporaryToken = (Token) windowsIdentityService.Identity.Guid.Value
                    });
                    (ClaimsPrincipal principal, SecurityToken authToken) = _jsonWebTokenService.ValidateToken(token);
                    var claims = new List<Claim>
                    {
                        new Claim(
                            RuleTypes.User, "true", ClaimValueTypes.Boolean, authToken.Issuer, authToken.Issuer),
                        new Claim(
                            RuleTypes.Token, token, ClaimValueTypes.String, authToken.Issuer, authToken.Issuer),
                        new Claim(
                            RuleTypes.ValidTo, authToken.ValidTo.ToUniversalTime().ToString("o", CultureInfo.InvariantCulture), ClaimValueTypes.DateTime, authToken.Issuer, authToken.Issuer)
                    };
                    claims.AddRange(principal.Claims);
                    claims.AddRange(windowsIdentityService.GetIdentityClaims());
                    var user = new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme));
                    var authenticationProperties = new AuthenticationProperties()
                    {
                        ExpiresUtc = authToken.ValidTo,
                        AllowRefresh = true,
                        IsPersistent = true
                    };
                    await context.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme, user, authenticationProperties);
                    context.Items[GlobalConstants.TemporaryUserKey] = user;
                }
                catch (System.Exception ex)
                {
                    throw new RestAuthenticationException(
                        context.User != null, windowsIdentityService.Identity != null, ex);
                }
            }
        }
    }
}
