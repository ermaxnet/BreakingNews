using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.Security.Claims;
using System.Security.Principal;
using BreakingNews.Application.Interfaces;

namespace BreakingNews.Infrastructure
{
    public sealed class WindowsIdentityService : IWindowsIdentityService
    {
        public UserPrincipal Identity { get; set; }

        public IEnumerable<Claim> GetIdentityClaims()
        {
            if (Identity == null)
            {
                return new List<Claim>();
            }
            return new List<Claim>
            {
                new Claim(ClaimTypes.GivenName, Identity.GivenName),
                new Claim(ClaimTypes.WindowsAccountName, Identity.UserPrincipalName),
                new Claim(ClaimTypes.Name, Identity.DisplayName),
                new Claim(ClaimTypes.Email, Identity.EmailAddress),
                new Claim(ClaimTypes.Surname, Identity.Surname)
            };
        }

        public void Invoke(WindowsIdentity identity)
        {
            WindowsIdentity.RunImpersonated(identity.AccessToken, () =>
            {
                using (var context = new PrincipalContext(ContextType.Domain))
                {
                    var identityUser = UserPrincipal.FindByIdentity(context, WindowsIdentity.GetCurrent().Name);
                    if (identityUser != null)
                    {
                        Identity = identityUser;
                    }
                }
            });
        }
    }
}
