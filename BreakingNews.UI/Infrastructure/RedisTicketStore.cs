using BreakingNews.Domain.Enums;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace BreakingNews.UI.Infrastructure
{
    public class RedisTicketStore : ITicketStore
    {
        private const string KeyPrefix = "AuthSessionStore-";
        private readonly IDistributedCache _cache;
        private readonly TicketSerializer _ticketSerializer;

        public RedisTicketStore(IDistributedCache cache, TicketSerializer ticketSerializer)
        {
            _cache = cache;
            _ticketSerializer = ticketSerializer;
        }

        public async Task<string> StoreAsync(AuthenticationTicket ticket)
        {
            var principal = ticket.Principal;
            var brewsGuid = principal.Claims.FirstOrDefault(
                claim => claim.Type == RuleTypes.SecurityStamp)?.Value;
            var guid = string.IsNullOrEmpty(brewsGuid) ? Guid.NewGuid().ToString() : brewsGuid;
            var key = KeyPrefix + guid;
            await RenewAsync(key, ticket);
            return key;
        }

        public async Task RenewAsync(string key, AuthenticationTicket ticket)
        {
            var options = new DistributedCacheEntryOptions();
            if (DateTime.TryParseExact(
                ticket.Principal.Claims.FirstOrDefault(claim => claim.Type == RuleTypes.ValidTo)?.Value, "o", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime expiresUtc))
            {
                options.SetAbsoluteExpiration(expiresUtc);
            }
            else
            {
                options.SetSlidingExpiration(TimeSpan.FromMinutes(30));
            }
            await _cache.SetAsync(key, _ticketSerializer.Serialize(ticket), options);
        }

        public async Task<AuthenticationTicket> RetrieveAsync(string key)
        {
            byte[] ticket = await _cache.GetAsync(key);
            return _ticketSerializer.Deserialize(ticket);
        }

        public async Task RemoveAsync(string key)
        {
            await _cache.RemoveAsync(key);
        }
    }
}
