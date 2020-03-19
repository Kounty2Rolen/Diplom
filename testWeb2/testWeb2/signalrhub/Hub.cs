using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using testWeb2.Classes;
using testWeb2.Controllers;

namespace testWeb2.signalrhub
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
        //protected IHubContext<CRUDServiceHubBase<TDTO>> _context;

        //public CRUDServiceHubBase(IHubContext<CRUDServiceHubBase<TDTO>> context)
        //{
        //    this._context = context;
        //}

        //public Task Create(TDTO entityDTO)
        //{
        //    return this._context.Clients.All.InvokeAsync(CreateEventName, entityDTO);
        //}
        public async Task Result(string message)
        {
            string randomEndingForFolder = Guid.NewGuid().ToString().Replace('-', '_');
            var code = new CodeCompile();
            var requestDatavar = JsonConvert.DeserializeObject<requestData>(message);
            code.Index(requestDatavar, this.Clients.All, randomEndingForFolder);
            await this.Clients.All.SendAsync("Result", "");
            
        }
        public static class UserHandler
        {
            public static List<string> ConnectedIds = new List<string>();
        }
    }

}

