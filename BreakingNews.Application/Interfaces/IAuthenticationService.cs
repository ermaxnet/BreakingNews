using BreakingNews.Domain.ValueObjects;
using System.Threading;
using System.Threading.Tasks;

namespace BreakingNews.Application.Interfaces
{
    public interface IAuthenticationService
    {
        Task<string> AuthenticateAsync(string temporaryToken, CancellationToken cancellationToken = default);
    }
}
