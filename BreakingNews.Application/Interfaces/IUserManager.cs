using BreakingNews.Domain.Entities;
using System.Threading.Tasks;

namespace BreakingNews.Application.Interfaces
{
    public interface IUserManager
    {
        Task<User> GetUserAsync();
    }
}
