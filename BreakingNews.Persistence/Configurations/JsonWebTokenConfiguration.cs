using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace BreakingNews.Persistence.Configurations
{
    [Serializable]
    public class JsonWebTokenConfiguration
    {
        public string Audience { get; set; }
        public string Issuer { get; set; }
        public string SecurityKey { get; set; }
        public SymmetricSecurityKey SymmetricSecurityKey => new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(SecurityKey));
    }
}
