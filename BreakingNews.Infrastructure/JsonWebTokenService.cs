using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BreakingNews.Application.Interfaces;
using BreakingNews.Domain.Enums;
using BreakingNews.Domain.ValueObjects;
using BreakingNews.Persistence.Configurations;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BreakingNews.Infrastructure
{
    public class JsonWebTokenService : IJsonWebTokenService
    {
        private readonly JsonWebTokenConfiguration _configuration;

        public JsonWebTokenService(IConfiguration configuration)
        {
            _configuration = configuration.GetSection("JsonWebToken")
                .Get<JsonWebTokenConfiguration>();
        }

        public SecurityToken IssueToken(Token temporaryToken)
        {
            return new JwtSecurityToken(
                issuer: _configuration.Audience,
                audience: _configuration.Issuer,
                claims: new[] {
                    new Claim(
                        RuleTypes.Guid, temporaryToken, ClaimValueTypes.String, _configuration.Audience, _configuration.Issuer)
                },
                expires: DateTime.Now.AddDays(30),
                signingCredentials: new SigningCredentials(_configuration.SymmetricSecurityKey, SecurityAlgorithms.HmacSha512));
        }

        public (ClaimsPrincipal, SecurityToken) ValidateToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ClockSkew = TimeSpan.FromMinutes(5),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration.Issuer,
                ValidAudience = _configuration.Audience,
                IssuerSigningKey = _configuration.SymmetricSecurityKey
            };
            var principal = new JwtSecurityTokenHandler()
                .ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            return (principal, securityToken);
        }
    }
}
