using DiplomWork.Classes;
using DiplomWork.Controllers;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DiplomWork.signalrhub
{
    public class RTTHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(new Exception());
        }
        public async Task Result(string message)
        {
            string randomEndingForFolder = Guid.NewGuid().ToString().Replace('-', '_');
            var code = new CodeCompile();
            var requestDatavar = JsonConvert.DeserializeObject<requestData>(message);
            code.Index(requestDatavar, this.Clients.Client(Context.ConnectionId), randomEndingForFolder);
            await this.Clients.All.SendAsync("Result", "");
        }

        public static class UserHandler
        {
            public static List<string> ConnectedIds = new List<string>();
        }
    }
}