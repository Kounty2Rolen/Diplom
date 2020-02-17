using System.Reflection;
using System;
using System.IO;
using System.IO.Pipes;



namespace CodeExecuter
{
    public static class Program
    {
        static int Main(string[] args)
        {
            try
            {
                TextWriter logWriter = new StreamWriter(Environment.CurrentDirectory + "/log.txt", true);

                NamedPipeClientStream pipeClient = new NamedPipeClientStream(".", "pipeServer", PipeDirection.InOut);
                Console.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connection");
                logWriter.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connection");
                pipeClient.Connect(-1);
                Console.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connected");
                logWriter.WriteLine(DateTime.Now + "|SYSLOG|=>$ " + "Connected");

                //StreamReader reader = new StreamReader(pipeClient);

                byte[] array = new byte[4];
                pipeClient.Read(array, 0, 4);
                var lenght = BitConverter.ToInt32(array, 0);
                logWriter.WriteLine(DateTime.Now + "|LOGED_DATA|=>$ " + "Data(Lenght):" + lenght.ToString());
                byte[] PeArray = new byte[lenght];
                pipeClient.Read(PeArray, 0, lenght);
                logWriter.WriteLine(DateTime.Now + "|LOGED_DATA|=>$ " + "Connected");

                var assembly = Assembly.Load(PeArray);
                var instance = assembly.CreateInstance("onfly.TestClass");
                var resultOut = assembly.GetType("onfly.TestClass").GetMethod("test").Invoke(instance, null).ToString();
                Console.WriteLine(resultOut);
                Console.WriteLine(resultOut);


                pipeClient.Close();
                pipeClient.Dispose();
                logWriter.Close();
                logWriter.Dispose();
            }
            catch (Exception ex)
            {
                TextWriter logWriter = new StreamWriter(Environment.CurrentDirectory + "/log.txt", true);
                logWriter.WriteLine(DateTime.Now + "|Exception|=>$ " + ex.ToString());
                System.Diagnostics.Debug.WriteLine(ex.Message);
                logWriter.Close();
                logWriter.Dispose();
            }

            return 0;

        }

        static void Disconnect(object sender, EventArgs args)
        {
            TextWriter logWriter = new StreamWriter(Environment.CurrentDirectory + "/log.txt", true);
            logWriter.Write(DateTime.Now + "|SYSLOG|=>$" + "Disconected");
            logWriter.Close();
            logWriter.Dispose();
        }
    }


}