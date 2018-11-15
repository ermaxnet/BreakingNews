using BreakingNews.Application.Interfaces;
using BreakingNews.Domain.Constants;
using BreakingNews.Domain.Entities;
using BreakingNews.Domain.Enums;
using BreakingNews.UI.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace BreakingNews.UI.Infrastructure
{
    public class RoleManager : IRoleManager
    {
        private const string RoleCacheKey = "RoleStore-";
        private readonly HttpContext _context;
        private readonly IDistributedCache _cache;
        private readonly CancellationToken _cancel;

        public RoleManager(IHttpContextAccessor contextAccessor, IDistributedCache cache)
        {
            _context = contextAccessor.HttpContext;
            _cache = cache;
            _cancel = _context.RequestAborted;
        }

        public async Task<IEnumerable<Role>> GetUserRolesAsync()
        {
            var key = GetCacheKey();
            var roles = await _cache.GetAsync<IEnumerable<Role>>(key, _cancel);
            if (roles == null)
            {
                return await GetUserRolesAndSaveOnStoreAsync(key);
            }
            return roles;
        }

        private string GetCacheKey()
        {
            var user = !(_context.Items[GlobalConstants.TemporaryUserKey] is ClaimsPrincipal temporaryUser) ? _context.User : temporaryUser;
            var brewsGuid = user.Claims.FirstOrDefault(
                claim => claim.Type == RuleTypes.SecurityStamp)?.Value;
            var guid = string.IsNullOrEmpty(brewsGuid) ? Guid.NewGuid().ToString() : brewsGuid;
            return RoleCacheKey + guid;
        }

        private async Task<IEnumerable<Role>> GetUserRolesAndSaveOnStoreAsync(string key)
        {
            IEnumerable<Claim> claims;
            ClaimsPrincipal user;
            if (_context.Items[GlobalConstants.TemporaryUserKey] is ClaimsPrincipal temporaryUser)
            {
                claims = temporaryUser.Claims;
                user = temporaryUser;
            }
            else
            {
                claims = _context.User.Claims;
                user = _context.User;
            }
            var applicationUserRoles = claims.Where(c => c.Type == ClaimTypes.Role).Select((claim, index) => new Role
            {
                Id = index,
                Title = claim.Value,
                NormalizedTitle = claim.Value.ToUpper(),
                ConcurrencyStamp = Guid.NewGuid()
            }).ToList();
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
            await _cache.SetAsync(key, applicationUserRoles, options, _cancel);
            return applicationUserRoles;
        }
    }
}
