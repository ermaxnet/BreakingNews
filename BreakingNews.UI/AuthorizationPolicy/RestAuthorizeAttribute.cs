using BreakingNews.Domain.Constants;
using Microsoft.AspNetCore.Authorization;

namespace BreakingNews.UI.AuthorizationPolicy
{
    public class RestAuthorizeAttribute : AuthorizeAttribute
    {
        public RestAuthorizeAttribute() : base()
        {
            Policy = GlobalConstants.RestPolicyName;
        }
    }
}
