//#define debug



using System.Reflection;
using System;
using System.IO;
using System.IO.Pipes;
using System.Linq;
using System.Threading;

namespace CodeExecuter
{

    public static class Program
    {

        static int Main(string[] args)
        {
            TextWriter logWriter = new StreamWriter(Environment.CurrentDirectory + "/log.txt", true);

            try
            {

                NamedPipeClientStream pipeClient = new NamedPipeClientStream(".", "pipeServer", PipeDirection.InOut);
#if debug
                Console.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connection");
#endif
                logWriter.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connection");
                pipeClient.Connect(-1);
#if debug
                Console.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connected");
#endif
                logWriter.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connected");

                //StreamReader reader = new StreamReader(pipeClient);

                byte[] array = new byte[4];
                pipeClient.Read(array, 0, 4);
                var lenght = BitConverter.ToInt32(array, 0);
                logWriter.WriteLine(DateTime.Now + "|LOGED_DATA|=>$ " + "Data(Lenght):" + lenght.ToString());
                byte[] PeArray = new byte[lenght];
                pipeClient.Read(PeArray, 0, lenght);
                logWriter.WriteLine(DateTime.Now + "|LOGED_DATA|=>$ " + "Readed");


                var assembly = Assembly.Load(PeArray);
                var instance = assembly.CreateInstance("onfly.TestClass");
                var resultOut = assembly.GetType("onfly.TestClass").GetMethod("test").Invoke(instance, null).ToString();
                logWriter.WriteLine(DateTime.Now + "|LOGED_DEBUG|=>$ " + String.Join(',', assembly.GetTypes().Select(c => c.FullName)));

                logWriter.WriteLine(DateTime.Now + "|Result|=>$ " + "\n\t{" + resultOut + "\n\t}");

                Console.WriteLine(resultOut);




                pipeClient.Close();
                pipeClient.Dispose();
                logWriter.Write(DateTime.Now + "|SYSLOG|=>$" + "Disconected");
                logWriter.Close();
                logWriter.Dispose();
            }
            catch (Exception ex)
            {

                logWriter.WriteLine(DateTime.Now + "|Exception|=>$ " + ex.ToString());
                logWriter.Close();
                logWriter.Dispose();
            }

            return 0;

        }

        static void Disconnect(object sender, EventArgs args)
        {
            TextWriter logWriter = new StreamWriter(Environment.CurrentDirectory + "/log.txt", true);
            logWriter.Close();
            logWriter.Dispose();
        }
    }


}