using Microsoft.AspNetCore.Mvc;

namespace BreakingNews.UI.ViewComponents
{
    public class NoticeViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
            => View();
    }
}
