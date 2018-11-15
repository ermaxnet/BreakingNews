using BreakingNews.Application.Interfaces;
using MediatR;
using System.IdentityModel.Tokens.Jwt;
using System.Threading;
using System.Threading.Tasks;

namespace BreakingNews.Application.Authentication.Queries
{
    public class AuthenticateOnRestServiceQueryHandler : IRequestHandler<AuthenticateOnRestServiceQuery, string>
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IJsonWebTokenService _jsonWebTokenService;

        public AuthenticateOnRestServiceQueryHandler(IAuthenticationService authenticationService, IJsonWebTokenService jsonWebTokenService)
        {
            _authenticationService = authenticationService;
            _jsonWebTokenService = jsonWebTokenService;
        }

        public Task<string> Handle(AuthenticateOnRestServiceQuery request, CancellationToken cancellationToken)
        {
            var token = new JwtSecurityTokenHandler().WriteToken(
               _jsonWebTokenService.IssueToken(request.TemporaryToken));
            return _authenticationService.AuthenticateAsync(token, cancellationToken);
        }
    }
}
