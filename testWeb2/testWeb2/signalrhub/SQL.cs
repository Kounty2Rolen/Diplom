using DiplomWork.Classes;
using DiplomWork.Controllers;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.NetworkInformation;
using Microsoft.AspNetCore.Mvc;

namespace DiplomWork.signalrhub
{
    [Route("/SQL")]
    public  class SQL : Hub
    {
        public static Result resultat = null;
        public static IClientProxy client;
        public  override Task OnConnectedAsync()
        {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(new Exception());
        }
        public  async Task PING()
        {
            client = this.Clients.Client(Context.ConnectionId);
            await this.Clients.Client(Context.ConnectionId).SendAsync("PONG",Context.ConnectionId);
            CodeCompile.proxyinit(this.Clients.Client(Context.ConnectionId));
            CodeController.proxyinit(this.Clients.Client(Context.ConnectionId));

        }
        public async Task Result(Result result)
        {
            resultat = result;
        }

        public async Task SQLINIT()
        {
            var a = 10;
        }
        public static class UserHandler
        {
            public static List<string> ConnectedIds = new List<string>();
        }
    }
    public class Result
    {

        public List<string> columns = new List<string>();
        public List<string> content = new List<string>();
    }
}