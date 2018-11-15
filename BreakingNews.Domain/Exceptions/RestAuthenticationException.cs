using System;

namespace BreakingNews.Domain.Exceptions
{
    public class RestAuthenticationException : Exception
    {
        public RestAuthenticationException(
            bool hasIdentity, 
            bool hasWindowsIdentity, 
            Exception ex) : base($"Bad authentication on rest service. Common identity {hasIdentity}. Windows identity {hasWindowsIdentity}.", ex)
        {}
    }
}
