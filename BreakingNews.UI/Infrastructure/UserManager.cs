using BreakingNews.Application.Interfaces;
using BreakingNews.Domain.Constants;
using BreakingNews.Domain.Entities;
using BreakingNews.Domain.Enums;
using BreakingNews.Domain.ValueObjects;
using BreakingNews.UI.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;

namespace BreakingNews.UI.Infrastructure
{
    public class UserManager : IUserManager
    {
        private const string UserCacheKey = "UserStore-";
        private readonly HttpContext _context;
        private readonly IWindowsIdentityService _windowsIdentityService;
        private readonly IDistributedCache _cache;
        private readonly CancellationToken _cancel;

        public UserManager(
            IHttpContextAccessor contextAccessor, 
            IWindowsIdentityService windowsIdentityService, 
            IDistributedCache cache)
        {
            _context = contextAccessor.HttpContext;
            _windowsIdentityService = windowsIdentityService;
            _cache = cache;
            _cancel = _context.RequestAborted;
        }

        public async Task<User> GetUserAsync()
        {
            var key = GetCacheKey();
            var applicationUser = await _cache.GetAsync<User>(key, _cancel);
            if (applicationUser == null)
            {
                return await GetUserAndSaveOnStoreAsync(key);
            }
            return applicationUser;
        }

        private string GetCacheKey()
        {
            var user = !(_context.Items[GlobalConstants.TemporaryUserKey] is ClaimsPrincipal temporaryUser) ? _context.User : temporaryUser;
            var brewsGuid = user.Claims.FirstOrDefault(
                claim => claim.Type == RuleTypes.SecurityStamp)?.Value;
            var guid = string.IsNullOrEmpty(brewsGuid) ? Guid.NewGuid().ToString() : brewsGuid;
            return UserCacheKey + guid;
        }

        private async Task<User> GetUserAndSaveOnStoreAsync(string key)
        {
            IEnumerable<Claim> claims;
            ClaimsPrincipal user;
            if (_context.Items[GlobalConstants.TemporaryUserKey] is ClaimsPrincipal temporaryUser)
            {
                claims = temporaryUser.Claims;
                user = temporaryUser;
            }
            else if (_context.User.Identity is WindowsIdentity)
            {
                claims = _windowsIdentityService.GetIdentityClaims();
                user = _context.User;
            }
            else
            {
                claims = _context.User.Claims;
                user = _context.User;
            }
            var applicationUser = new User
            {
                FirstName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                LastName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value,
                Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                AdAccount = (AdAccount) claims.FirstOrDefault(c => c.Type == ClaimTypes.WindowsAccountName)?.Value,
                IsAuthenticated = user.HasClaim(c => c.Type == RuleTypes.User)
            };
            if (Guid.TryParse(claims.FirstOrDefault(c => c.Type == RuleTypes.Guid)?.Value, out Guid windowsGuid))
            {
                applicationUser.AdGuid = (Token) windowsGuid;
            }
            var options = new DistributedCacheEntryOptions();
            if (DateTime.TryParseExact(
                    user.FindFirst(c => c.Type == RuleTypes.ValidTo)?.Value, "o", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime expiresUtc))
            {
                options.SetAbsoluteExpiration(expiresUtc);
            }
            else
            {
                options.SetSlidingExpiration(TimeSpan.FromMinutes(30));
            }
            await _cache.SetAsync(key, applicationUser, options, _cancel);
            return applicationUser;
        }
    }
}
