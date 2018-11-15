using System.Collections.Generic;

namespace BreakingNews.UI.ViewModels
{
    public class MenuItemViewModel
    {
        public string Name { get; set; }
        public string ActionName { get; set; } = "Index";
        public string ControllerName { get; set; }
        public string IconCssClass { get; set; }
        public bool IsHome { get; set; }
        public IDictionary<string, string> Parameters { get; set; }
    }
}
