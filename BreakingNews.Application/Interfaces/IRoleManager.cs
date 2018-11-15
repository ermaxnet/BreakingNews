using BreakingNews.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BreakingNews.Application.Interfaces
{
    public interface IRoleManager
    {
        Task<IEnumerable<Role>> GetUserRolesAsync();
    }
}
