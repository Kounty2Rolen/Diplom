using DiplomWork.Controllers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Pipes;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DiplomWork.Classes
{
    public class CodeCompile
    {
        public void Index(requestData text, IClientProxy clientProxy, string randomEndingForFolder)
        {
            try
            {
                string usng = "";
                string context = "";
                Tempproj tempproj = null;
                if (text.serializeAnonProj != null)
                {
                    tempproj = JsonConvert.DeserializeObject<Tempproj>(text.serializeAnonProj);
                    text.ContextName = tempproj.Data.ContextName;
                    usng = @"using DiplomWork;";
                    context = @"var db = new " + text.ContextName + "();" + @";
                                db.GetService<ILoggerFactory>().AddProvider(new MyLoggerProvider());";
                }
                string codeHead = @"
                                using System;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Infrastructure;"
+
usng
+ @"
using System.Linq;

namespace onfly
{
    public class TestClass
    {
        static string log="""";
        public class MyLoggerProvider : ILoggerProvider
        {
            public ILogger CreateLogger(string categoryName)
            {
                return new MyLogger();
            }

            public void Dispose() { }

            private class MyLogger : ILogger
            {
                public IDisposable BeginScope<TState>(TState state)
                {
                    return null;
                }

                public bool IsEnabled(LogLevel logLevel)
                {
                    return true;
                }

                public void Log<TState>(LogLevel logLevel, EventId eventId,
                        TState state, Exception exception, Func<TState, Exception, string> formatter)
                {
                Console.Error.WriteLine(formatter(state, exception));
                }
            }
        }

        public static void Main() {
}
        public static void CodeCompile()
        {"
+ context;



                string sourceCode = codeHead + text.SourceCode + "}}}";
                using (var peStream = new MemoryStream())
                {
                    Microsoft.CodeAnalysis.Emit.EmitResult result;
                    if (tempproj == null)
                    {
                        result = GenerateCode(sourceCode).Emit(peStream);
                    }
                    else
                    {
                        result = GenerateCode(sourceCode, tempproj).Emit(peStream);
                    }
                    peStream.Seek(0, SeekOrigin.Begin);
                    if (!result.Success)
                    {
                        var failures = result.Diagnostics.Where(diagnostic => diagnostic.IsWarningAsError || diagnostic.Severity == DiagnosticSeverity.Error);

                        StringBuilder bld = new StringBuilder();
                        foreach (var diagnostic in failures)
                        {
                            clientProxy.SendAsync("Exception", diagnostic.ToString());
                            bld.Append(diagnostic);//StringBuilder more efficient than concat
                        }
                        Result result1 = new Result();
                        result1.resultcode = bld.ToString();
                    }
                    peStream.Seek(0, SeekOrigin.Begin);

                    string sql = "";
                    string resultcode = "";
                    using (var proc = new Process())
                    {
                        CancellationTokenSource cts = new CancellationTokenSource();
                        Task<Result> newTask = Task.Run(() =>
                        {
                            try
                            {
                                proc.StartInfo.FileName = Environment.CurrentDirectory + @"\CodeExecuter\netcoreapp3.1\CodeExecuter.exe";
                                proc.StartInfo.RedirectStandardOutput = true;
                                proc.StartInfo.UseShellExecute = false;
                                proc.StartInfo.RedirectStandardError = true;

                                proc.ErrorDataReceived += new DataReceivedEventHandler((sender, e) =>
                                {
                                    clientProxy.SendAsync("SQL", e.Data + "\n");
                                });
                                proc.OutputDataReceived += new DataReceivedEventHandler((sender, e) =>
                                {
                                    clientProxy.SendAsync("Result", e.Data + "\n");
                                });
                                proc.StartInfo.Arguments = randomEndingForFolder;/*User.Identity?.Name ?? Request.HttpContext.TraceIdentifier;*/
                                proc.StartInfo.WindowStyle = ProcessWindowStyle.Maximized;

                                proc.Start();
                                proc.BeginOutputReadLine();
                                proc.BeginErrorReadLine();
                                NamedPipeServerStream pipeServer = new NamedPipeServerStream("pipeServer" + randomEndingForFolder, PipeDirection.InOut);
                                pipeServer.WaitForConnection();
                                var length = BitConverter.GetBytes((int)peStream.Length);
                                pipeServer.Write(length, 0, length.Length);
                                peStream.CopyTo(pipeServer);
                                proc.WaitForExit(15000);
                                proc.Close();
                                pipeServer.Close();
                                pipeServer.Dispose();
                                Result result1 = new Result();
                                result1.sql = sql;
                                result1.resultcode = resultcode;
                                clientProxy.SendAsync("Result", "True");
                                return result1;
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                        }, cts.Token);
                        newTask.Wait(300000);//Timeout 5 min 300000
                        if (newTask.IsCompleted)
                        { }
                        else
                        {
                            proc.Kill();
                            cts.Cancel();
                            throw new TimeoutException("TimeOut too long operation");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Result result = new Result();
                result.resultcode = ex.ToString();
                clientProxy.SendAsync("Exeption", ex);
            }
        }

        private List<string> GetModelsCode(Tempproj tempproj)
        {
            List<string> trees = new List<string>();
            if (tempproj != null)
            {
                tempproj.Models.ForEach(c => trees.Add(c));
            }
            return trees;
        }

        private CSharpCompilation GenerateCode(string sourceCode = null, Tempproj tempproj = null)
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies();

            var trees = new List<SyntaxTree>();
            var codeString = SourceText.From(sourceCode);
            var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Latest);
            trees.Add(SyntaxFactory.ParseSyntaxTree(codeString, options));
            trees.AddRange(GetModelsCode(tempproj).Select(c =>
            {
                return SyntaxFactory.ParseSyntaxTree(SourceText.From(c), options);
            }));

            List<MetadataReference> references = new List<MetadataReference>()
            {
                MetadataReference.CreateFromFile(assembly.First(c=>c.FullName.StartsWith("netstandard")).Location),
                MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Linq.Expressions.BinaryExpression).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(RelationalDatabaseFacadeExtensions).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.ComponentModel.TypeConverter).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(DbContext).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.ComponentModel.IComponent).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Process).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Runtime.AssemblyTargetedPatchBandAttribute).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(DbContext).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(HashSet<>).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(DbContextOptionsBuilder<>).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(SqlServerDbContextOptionsExtensions).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Data.Common.DataAdapter).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.EntityFrameworkCore.Infrastructure.ModelCacheKey).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.Extensions.Logging.EventId).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.Extensions.Logging.Abstractions.NullLogger).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(IServiceProvider).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Runtime.Versioning.FrameworkName).Assembly.Location)
            };

            return CSharpCompilation.Create("CompiledCode.dll",
        trees.ToArray(),
        references: references,
        options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary,
            optimizationLevel: OptimizationLevel.Release,
            assemblyIdentityComparer: DesktopAssemblyIdentityComparer.Default, platform: Platform.X64));
        }
    }
}