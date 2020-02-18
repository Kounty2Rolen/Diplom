using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.IO.Pipes;
using Microsoft.AspNetCore.Authorization;

namespace testWeb2.Controllers
{
    //[Route("api/[controller]")]
    public class CodeController : Controller
    {



        /// <summary>
        /// ����������� ���
        /// </summary>
        /// <param name="text">��� ������� ���������� ���������</param>
        /// <returns>��������� ���������� ����</returns>
        /// 

        public string Index([FromBody]requestData text)
        {
            try
            {
                if (text.ContextName == null)
                    text.ContextName = "Context";
                string codeHead = @"
                                using System;
                                using System.Diagnostics;
                                using Microsoft.EntityFrameworkCore;
                                using Microsoft.Extensions.Logging;
                                using Microsoft.EntityFrameworkCore.Infrastructure;
                                using testWeb2.Model;
                                using System.Linq;

                                namespace onfly
                                {
                                 class MyLoggerProvider : ILoggerProvider
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
                                            public void Log<TState>(LogLevel logLevel, EventId eventId,TState state, Exception exception, Func<TState, Exception, string> formatter)
                                             {
                                                Console.WriteLine(formatter(state, exception));
                                             }
                                        }
                                    }
                                    public class TestClass
                                     {
                                    public static void Main(){}
                                    public static string test()
                                       { " + text.ContextName + " db " + "= new " + text.ContextName + "();" + @"
                    db.GetService<ILoggerFactory>().AddProvider(new MyLoggerProvider());

                                        ";

                string codeFoot = @"}}}";
                string sourceCode = codeHead + text.SourceCode + codeFoot;
                using (var peStream = new MemoryStream())
                {
                    MemoryStream modelStream = new MemoryStream();
                    var trees = GetSyntaxTrees();
                    GenerateCode(trees: trees).Emit(modelStream);
                    modelStream.Seek(0, SeekOrigin.Begin);
                    var result = GenerateCode(sourceCode, trees, modelStream, true).Emit(peStream);
                    modelStream.Dispose();
                    if (!result.Success)
                    {
                        string error = "";

                        var failures = result.Diagnostics.Where(diagnostic => diagnostic.IsWarningAsError || diagnostic.Severity == DiagnosticSeverity.Error);

                        foreach (var diagnostic in failures)
                        {
                            error += "\n" + diagnostic.ToString();
                        }
                        return error;
                    }

                    peStream.Seek(0, SeekOrigin.Begin);
                    ProcessStartInfo startInfo = new ProcessStartInfo()
                    {
                        FileName = Environment.CurrentDirectory + @"\bin\Debug\netcoreapp3.1\CodeExecuter.exe",
                        Arguments = System.Text.Encoding.ASCII.GetString(peStream.ToArray()),
                        RedirectStandardOutput = true,
                        RedirectStandardInput = true,
                        UseShellExecute = false
                    };
                    string resultOut = "";
                    using (var proc = new Process())
                    {
                        proc.StartInfo.FileName = Environment.CurrentDirectory + @"\bin\Debug\netcoreapp3.1\CodeExecuter.exe";
                        proc.StartInfo.Arguments = System.Text.Encoding.ASCII.GetString(peStream.ToArray());
                        proc.StartInfo.RedirectStandardOutput = true;
                        proc.StartInfo.RedirectStandardInput = true;
                        proc.StartInfo.UseShellExecute = false;
                        proc.OutputDataReceived += new DataReceivedEventHandler((sender, e) => {
                            resultOut += e.Data;
                        });
                        proc.Start();

                        NamedPipeServerStream pipeServer = new NamedPipeServerStream("pipeServer", PipeDirection.InOut);
                        pipeServer.WaitForConnection();
                        var length = BitConverter.GetBytes((int)peStream.Length);
                        pipeServer.Write(length, 0, length.Length);
                        peStream.CopyTo(pipeServer);
                        proc.BeginOutputReadLine();
                        proc.WaitForExit();

                        //var procin = proc.StandardInput; 
                        //procin.WriteLine("1");

                        //var assembly = Assembly.Load(peStream.ToArray());
                        //var instance = assembly.CreateInstance("onfly.TestClass");
                        //var resultOut = assembly.GetType("onfly.TestClass").GetMethod("test").Invoke(instance, null).ToString();
                        proc.CancelOutputRead();
                        pipeServer.Close();
                        pipeServer.Dispose();
                    }
                    return resultOut;
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        private static List<SyntaxTree> GetSyntaxTrees()
        {
            List<SyntaxTree> trees = new List<SyntaxTree>();
            //Обьеденение всех файлов модели в один файл
            foreach (var file in Directory.GetFiles(Path.GetTempPath() + "/Model"))
            {
                StreamReader reader = new StreamReader(file.ToString());
                var code = SourceText.From(reader.ReadToEnd());
                var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Latest);
                trees.Add(SyntaxFactory.ParseSyntaxTree(code, options));
                reader.Close();
                reader.Dispose();
            }

            return trees;
        }

        /// <summary>
        /// ���������� ��� � ������
        /// </summary>
        /// <param name="sourceCode">�������� ��� ���������� </param>
        /// <returns></returns>
        private static CSharpCompilation GenerateCode(string sourceCode = null, List<SyntaxTree> trees = null, MemoryStream modelStream = null, bool isproject = false)
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies();
            if (isproject)
            {
                trees = new List<SyntaxTree>();
                var codeString = SourceText.From(sourceCode);
                var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Latest);
                trees.Add(SyntaxFactory.ParseSyntaxTree(codeString, options));
            }

            List<MetadataReference> references = new List<MetadataReference>()
            {
                MetadataReference.CreateFromFile(assembly.First(c=>c.FullName.StartsWith("netstandard")).Location),
                //MetadataReference.CreateFromFile(assebly.First(c=>c.FullName.StartsWith("mscorelib")).Location),
                //MetadataReference.CreateFromFile(@"C:\Program Files\dotnet\sdk\3.1.100\Microsoft\Microsoft.NET.Build.Extensions\net461\lib\netstandard.dll"),
                MetadataReference.CreateFromFile(typeof(System.Linq.Enumerable).Assembly.Location),
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
                MetadataReference.CreateFromFile(typeof(Microsoft.Extensions.Logging.ILogger).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.IServiceProvider).Assembly.Location)



            };
            if (isproject)
            {
                //BAd il format
                references.Add(MetadataReference.CreateFromStream(modelStream));
            }
            return CSharpCompilation.Create("CompiledCode.dll",
        trees.ToArray(),
        references: references,
        options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary,
            optimizationLevel: OptimizationLevel.Release,
            assemblyIdentityComparer: DesktopAssemblyIdentityComparer.Default, platform: Platform.X64));
        }
        [Authorize]
        public string ModelGenerate([FromBody] ConectionData data)
        {
            try
            {

                if (string.IsNullOrEmpty(data.ContextName))
                {
                    data.ContextName = "Context";
                }
                if (!string.IsNullOrEmpty(data.ConnectionString))
                {
                    var reportHandler = new OperationReportHandler();
                    var resultHandler = new OperationResultHandler();
                    var executor = new OperationExecutor(reportHandler, new Dictionary<string, string> {
                    { "targetName", "testWeb2" },
                    { "startupTargetName", "testWeb2" },
                    { "projectDir", Path.GetTempPath() + "/Model"},
                    { "rootNamespace", "testWeb2" } });
                    var context = new OperationExecutor.ScaffoldContext(executor, resultHandler, new Dictionary<string, object> {
                    {"connectionString", data.ConnectionString },
                    {"provider", "Microsoft.EntityFrameworkCore.SqlServer"},
                    { "outputDir", "Model" },
                    {"dbContextClassName",data.ContextName},
                    {"outputDbContextDir","Model" },
                    {"schemaFilters",new string[]{"dbo"} },//Фильр схем н-р DBO
                    {"tableFilters",new string[0] },//Фильр таблиц
                    {"useDataAnnotations",false },
                    {"overwriteFiles",true },
                    { "useDatabaseNames",false} });
                    context.Execute(new Action(() => { }));
                    Model.Context context1 = new Model.Context();
                    Model.CompiledContext compiled = new Model.CompiledContext();
                    var trees = GetSyntaxTrees();
                    MemoryStream modelStream = new MemoryStream();
                    GenerateCode(trees: trees).Emit(modelStream);
                    modelStream.Seek(0, SeekOrigin.Begin);
                    compiled.CompiledContext1 = modelStream.ToArray();
                    Model.Projects project = new Model.Projects();
                    project.ProjectName = data.ProjName;
                    project.ContextName = data.ContextName;
                    project.ConnectionString = data.ConnectionString;
                    project.OwnerId = context1.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault().Id;
                    project.Owner = context1.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault();
                    project.Id = context1.Projects.LastOrDefault()?.Id + 1 ?? 0;
                    compiled.Id = context1.CompiledContext.LastOrDefault()?.Id + 1 ?? 0;
                    context1.Add(project);
                    compiled.Project = project;
                    compiled.ProjectId = context1.Projects.LastOrDefault(c => c.OwnerId == project.OwnerId)?.Id ?? 0;
                    context1.Add(compiled);
                    context1.SaveChanges();

                    return "True";
                }
                else
                {
                    return "False";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public class ConectionData
        {
            public string ConnectionString { get; set; }
            public string ContextName { get; set; }
            public string ProjName { get; set; }
        }

        public class requestData
        {
            public string SourceCode { get; set; }
            public string ContextName { get; set; }
        }
    }
}