using BreakingNews.Domain.ValueObjects;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace BreakingNews.Application.Interfaces
{
    public interface IJsonWebTokenService
    {
        (ClaimsPrincipal, SecurityToken) ValidateToken(string token);
        SecurityToken IssueToken(Token temporaryToken);
    }
}
