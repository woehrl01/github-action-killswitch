using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace github_killswitch
{
    public class KillSwitchHub : Hub
    {
        public async Task RegisterGroup(string groupName){
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task SendKill(string actionId)
        {
            await Clients.OthersInGroup(actionId).SendAsync("ExecuteKill", actionId);
        }

        public async Task AckKill(string actionId){
            await Clients.OthersInGroup(actionId).SendAsync("ConfirmKill", actionId);
        }
    }
}