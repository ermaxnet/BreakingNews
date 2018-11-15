using BreakingNews.Domain.ValueObjects;
using MediatR;

namespace BreakingNews.Application.Authentication.Queries
{
    public class AuthenticateOnRestServiceQuery : IRequest<string>
    {
        public Token TemporaryToken { get; set; }
    }
}
