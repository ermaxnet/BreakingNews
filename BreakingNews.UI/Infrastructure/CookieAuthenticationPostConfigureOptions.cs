using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace BreakingNews.UI.Infrastructure
{
    public class CookieAuthenticationPostConfigureOptions : IPostConfigureOptions<CookieAuthenticationOptions>
    {
        private readonly IDistributedCache _cache;
        private readonly TicketSerializer _ticketSerializer;

        public CookieAuthenticationPostConfigureOptions(IDistributedCache cache, TicketSerializer ticketSerializer)
        {
            _cache = cache;
            _ticketSerializer = ticketSerializer;
        }

        public void PostConfigure(string name, CookieAuthenticationOptions options)
        {
            options.SessionStore = new RedisTicketStore(_cache, _ticketSerializer);
        }
    }
}
