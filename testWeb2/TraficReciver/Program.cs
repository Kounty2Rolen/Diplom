using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net.NetworkInformation;

namespace TraficReciver
{
    class Program
    {
        static void Main(/*string[] args*/)
        {
            try
            {
                var sqlConnection = new SqlConnection();
                List<string> args = new List<string>();
                string ConnectionId;
                args.Add("https://localhost:44333/sql");

                var hubFactory = new HubConnectionBuilder();
                var HubConnection = hubFactory.WithUrl(args[0]).Build();
                HubConnection.On<string>("PONG", (param) => {
                    Console.WriteLine("Your connection ID"+param);
                    ConnectionId = param;
                    Console.WriteLine("Enter the id in the field on the site");

                });
                HubConnection.On<string>("SQLEXECUTE", (param) => {
                    if(param!= "Compiling query model: ")
                        
                    if (sqlConnection.State == System.Data.ConnectionState.Open)
                    {
                        var command=sqlConnection.CreateCommand();
                        command.CommandText = param;
                        var reader=command.ExecuteReader();
                        var result = new Result();
                        if (reader.HasRows)
                        {
                            for (int i = 0; i <= reader.FieldCount; i++)
                            {
                                result.columns.Add(reader.GetName(i));

                            }
                            while (reader.Read())
                            {
                                for (int j = 0; j <= reader.FieldCount; j++)
                                {
                                    result.content.Add(reader.GetValue(j).ToString());
                                    
                                }
                            }
                            
                        }
                        Console.WriteLine(param);
                        HubConnection.InvokeAsync("Result", result);
                    }

                });
                HubConnection.On<string>("SQLINIT", (param) => {
                    sqlConnection.ConnectionString = param;
                    sqlConnection.Open();
                });
                
                HubConnection.StartAsync();
                HubConnection.InvokeAsync("PING");
                HubConnection.InvokeAsync("SQLINIT");
                HubConnectionState state=HubConnectionState.Connected;
                while (HubConnection.State != HubConnectionState.Disconnected)
                {
                    if (state != HubConnection.State)
                    {
                        state = HubConnection.State;
                        Console.WriteLine(state);
                    }

                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString()+ex.StackTrace);
                Console.ReadLine();
            }

        }
        public class Result {

            public List<string> columns = new List<string>();
            public List<string> content = new List<string>();
        }

    }
}
