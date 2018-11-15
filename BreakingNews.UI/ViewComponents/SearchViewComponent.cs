using Microsoft.AspNetCore.Mvc;

namespace BreakingNews.UI.ViewComponents
{
    public class SearchViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
            => View();
    }
}
