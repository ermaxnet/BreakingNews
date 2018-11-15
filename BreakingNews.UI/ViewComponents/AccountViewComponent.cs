using BreakingNews.Application.Interfaces;
using BreakingNews.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BreakingNews.UI.ViewComponents
{
    public class AccountViewComponent : ViewComponent
    {
        private readonly IUserManager _userManager;

        public AccountViewComponent(IUserManager userManager)
        {
            _userManager = userManager;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var user = await _userManager.GetUserAsync();
            var viewModel = new AccountViewModel
            {
                DisplayName = $"{user.FirstName} {user.LastName}"
            };
            return View(viewModel);
        }
    }
}
