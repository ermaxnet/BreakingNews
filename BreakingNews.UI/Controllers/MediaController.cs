using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace BreakingNews.UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        readonly IHostingEnvironment _env;

        public MediaController(IHostingEnvironment env)
        {
            _env = env;
        }

        [Route("[action]/{name}")]
        public IActionResult Test(string name)
        {
            return new JsonResult(new { name });
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> Upload()
        {
            IFormFileCollection files = Request.Form.Files;
            var result = new List<string>();
            foreach (var file in files)
            {
                string path = "/files/" + file.FileName;
                using (var fs = new FileStream(_env.WebRootPath + path, FileMode.Create))
                {
                    await file.CopyToAsync(fs);
                }
                result.Add(path);
            }
            return new JsonResult(result);
        }
    }
}
