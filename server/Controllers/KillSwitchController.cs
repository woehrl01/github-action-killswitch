using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace github_killswitch {

    [Route("api/kill")]
    public class DemoController : Controller
    {
        IHubContext<KillSwitchHub> _killSwitchHubContext;
        public DemoController(IHubContext<KillSwitchHub> killSwitchHubContext)
        {
            _killSwitchHubContext = killSwitchHubContext;
        }

        [Route("{actionId}")]
        [HttpPost]
        public async Task<OkResult> Post(string actionId)
        {
            await _killSwitchHubContext.Clients.Group(actionId).SendAsync("ExecuteKill", actionId);
            return Ok();
        }
    }
}