﻿//#define debug



using System.Reflection;
using System;
using System.IO;
using System.IO.Pipes;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CodeExecuter
{

    public static class Program
    {

        static int Main(string[] args)
        {
            
            TextWriter logWriter = new StreamWriter(Environment.CurrentDirectory + "\\log.txt", true);
            try
            {

                NamedPipeClientStream pipeClient = new NamedPipeClientStream(".", "pipeServer"+args[0], PipeDirection.InOut);
#if debug
                Console.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connection");
#endif
                logWriter.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connection.... Iddentificator:"+args[0]);
                pipeClient.Connect(15000);
#if debug
                Console.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connected");
#endif
                logWriter.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connected");

                byte[] array = new byte[4];
                pipeClient.Read(array, 0, 4);
                var lenght = BitConverter.ToInt32(array, 0);
                logWriter.WriteLine(DateTime.Now + "|LOGED_DATA|=>$ " + "Data(Lenght):" + lenght);
                byte[] PeArray = new byte[lenght];
                pipeClient.Read(PeArray, 0, lenght);
                logWriter.WriteLine(DateTime.Now + "|LOGED_DATA|=>$ " + "Readed");

                var assembly = Assembly.Load(PeArray);
                var instance = assembly.CreateInstance("onfly.TestClass");
                var resultOut = assembly.GetType("onfly.TestClass").GetMethod("CodeCompile").Invoke(instance, null).ToString();

                logWriter.WriteLine(DateTime.Now + "|Result|=>$ " + "\n\t{" + resultOut + "\n\t}");


                Console.Error.WriteLine(resultOut);


                
                pipeClient.Close();
                pipeClient.Dispose();
                logWriter.WriteLine(DateTime.Now + "|SYSLOG|=>$" + "Disconected");
                logWriter.Flush();
                logWriter.Close();
                logWriter.Dispose();
            }
            catch (Exception ex)
            {

                logWriter.WriteLine(DateTime.Now + "|Exception|=>$ " + ex);
                logWriter.Flush();
                logWriter.Close();
                logWriter.Dispose();
            }
            Thread.Sleep(1000);
            return 0;

        }


    }


}