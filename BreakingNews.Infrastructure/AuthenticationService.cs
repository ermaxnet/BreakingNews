using BreakingNews.Application.Interfaces;
using BreakingNews.Domain.Enums;
using BreakingNews.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace BreakingNews.Infrastructure
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly RestContext _restContext;

        public AuthenticationService(RestContext restContext)
        {
            _restContext = restContext;
        }

        public async Task<string> AuthenticateAsync(string temporaryToken, CancellationToken cancellationToken = default)
        {
            var responseMessage = await _restContext.GetAsync(
                Rest.Authentication.Authenticate, temporaryToken, cancellationToken);
            return await responseMessage.Content.ReadAsStringAsync();
        }
    }
}
