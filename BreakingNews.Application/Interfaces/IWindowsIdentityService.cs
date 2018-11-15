using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.Security.Claims;
using System.Security.Principal;

namespace BreakingNews.Application.Interfaces
{
    public interface IWindowsIdentityService
    {
        UserPrincipal Identity { get; set; }
        IEnumerable<Claim> GetIdentityClaims();
        void Invoke(WindowsIdentity identity);
    }
}
