using Microsoft.AspNetCore.Mvc;

namespace BreakingNews.UI.ViewComponents
{
    public class TouchViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
            => View();
    }
}
