using BreakingNews.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace BreakingNews.UI.ViewComponents
{
    public class MenuViewComponent : ViewComponent
    {
        private readonly IConfiguration _configuration;

        public MenuViewComponent(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IViewComponentResult Invoke()
        {
            var items = _configuration.GetSection("MenuItems")
                .Get<IEnumerable<MenuItemViewModel>>();
            return View(items);
        }
    }
}
