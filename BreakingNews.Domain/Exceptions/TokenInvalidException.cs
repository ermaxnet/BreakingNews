using System;

namespace BreakingNews.Domain.Exceptions
{
    public class TokenInvalidException : Exception
    {
        public TokenInvalidException(string value, Exception ex)
           : base($"Token value \"{value}\" is invalid.", ex)
        {
        }
    }
}
