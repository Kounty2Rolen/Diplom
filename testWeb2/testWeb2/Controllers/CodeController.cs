using Microsoft.AspNetCore.Authorization;
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
using System.IO.Pipes;
using System.Linq;

namespace testWeb2.Controllers
{
    [Authorize]
    [AllowAnonymous]
    public class CodeController : Controller
    {


        public IActionResult Index([FromBody]requestData text)
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
                Console.WriteLine(formatter(state, exception));
                }
            }
        }

        public static void Main() {
}
        public static string CodeCompile()
        {
            var db = new " + text.ContextName + "();" + @";
            db.GetService<ILoggerFactory>().AddProvider(new MyLoggerProvider());
                ";
                /* var " + "db" + "= new " + text.ContextName + "();" + @"
                    db.GetService<ILoggerFactory>().AddProvider(new MyLoggerProvider());*/

                string sourceCode = codeHead + text.SourceCode + "}}}";
                using (var peStream = new MemoryStream())
                {
                    //MemoryStream modelStream = new MemoryStream();
                    //var trees = GetModelsCode();
                    //GenerateCode(trees: trees).Emit(modelStream);
                    //modelStream.Seek(0, SeekOrigin.Begin);
                    var result = GenerateCode(sourceCode).Emit(peStream);
                    peStream.Seek(0, SeekOrigin.Begin);
                    if (!result.Success)
                    {
                        string error = "";

                        var failures = result.Diagnostics.Where(diagnostic => diagnostic.IsWarningAsError || diagnostic.Severity == DiagnosticSeverity.Error);

                        foreach (var diagnostic in failures)
                        {
                            error += "\n" + diagnostic.ToString();
                        }
                        Result result1 = new Result();
                        result1.resultcode = error;
                        return Ok(result1);
                    }
                    peStream.Seek(0, SeekOrigin.Begin);
                    string sql = "";
                    string resultcode = "";
                    using (var proc = new Process())
                    {
                        proc.StartInfo.FileName = Environment.CurrentDirectory + @"\CodeExecuter\netcoreapp3.1\CodeExecuter.exe";
                        proc.StartInfo.RedirectStandardOutput = true;
                        proc.StartInfo.UseShellExecute = false;
                        proc.StartInfo.RedirectStandardError = true;
                        proc.ErrorDataReceived += new DataReceivedEventHandler((sender, e) =>
                        {
                            resultcode += e.Data;

                        });
                        proc.OutputDataReceived += new DataReceivedEventHandler((sender, e) =>
                        {
                            sql += e.Data;
                        });

                        proc.Start();
                        proc.BeginOutputReadLine();
                        proc.BeginErrorReadLine();
                        NamedPipeServerStream pipeServer = new NamedPipeServerStream("pipeServer", PipeDirection.InOut);
                        pipeServer.WaitForConnection();
                        var length = BitConverter.GetBytes((int)peStream.Length);
                        pipeServer.Write(length, 0, length.Length);
                        peStream.CopyTo(pipeServer);


                        proc.WaitForExit(15000); //BUG
                        proc.Close();

                        //var procin = proc.StandardInput;
                        //procin.WriteLine("1");

                        //var assembly = Assembly.Load(peStream.ToArray());
                        //var instance = assembly.CreateInstance("onfly.TestClass");
                        //var resultOut = assembly.GetType("onfly.TestClass").GetMethod("test").Invoke(instance, null).ToString();
                        pipeServer.Close();
                        pipeServer.Dispose();
                        Result result1 = new Result();
                        //result1.sql = message.ToString();
                        result1.sql = sql;
                        result1.resultcode = resultcode;
                        //result1.sql = System.IO.File.ReadAllText(Path.GetTempPath() + "\\Model\\Sqllog.txt");
                        return Ok(result1);
                    }
                }
            }
            catch (Exception ex)
            {
                Result result = new Result();
                result.resultcode = ex.ToString();
                return Ok(result);
            }
        }

        private static List<string> GetModelsCode()
        {
            List<string> trees = new List<string>();
            foreach (var file in Directory.GetFiles(Path.GetTempPath() + "/Model"))
            {
                if (file.Contains(".cs"))
                {
                    using (StreamReader reader = new StreamReader(file.ToString()))
                    {
                        //var code = SourceText.From(reader.ReadToEnd());
                        //var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Latest);
                        trees.Add(reader.ReadToEnd());
                    }
                }
            }

            return trees;
        }


        private static CSharpCompilation GenerateCode(string sourceCode = null)
        {
            var assembly = AppDomain.CurrentDomain.GetAssemblies();

            var trees = new List<SyntaxTree>();
            var codeString = SourceText.From(sourceCode);
            var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Latest);
            trees.Add(SyntaxFactory.ParseSyntaxTree(codeString, options));
            trees.AddRange(GetModelsCode().Select(c =>
            {
                return SyntaxFactory.ParseSyntaxTree(SourceText.From(c), options);
            }));

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
                MetadataReference.CreateFromFile(typeof(Microsoft.Extensions.Logging.EventId).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.Extensions.Logging.Abstractions.NullLogger).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.IServiceProvider).Assembly.Location)
            };

            return CSharpCompilation.Create("CompiledCode.dll",
        trees.ToArray(),
        references: references,
        options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary,
            optimizationLevel: OptimizationLevel.Release,
            assemblyIdentityComparer: DesktopAssemblyIdentityComparer.Default, platform: Platform.X64));
        }

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
                    { "projectDir", Path.GetTempPath()},
                    { "rootNamespace", "testWeb2" } });
                    var context = new OperationExecutor.ScaffoldContext(executor, resultHandler, new Dictionary<string, object> {
                    {"connectionString", data.ConnectionString },
                    {"provider", "Microsoft.EntityFrameworkCore.SqlServer"},
                    { "outputDir", "Model" },
                    {"dbContextClassName",data.ContextName},
                    {"outputDbContextDir","Model" },
                    {"schemaFilters",new string[]{"dbo"} },//Фильр схем н-р DBO
                    {"tableFilters",Array.Empty<string>() },//Фильр таблиц
                    {"useDataAnnotations",false },
                    {"overwriteFiles",true },
                    { "useDatabaseNames",false} });
                    context.Execute(new Action(() => { }));
                    //Model.Context context1 = new Model.Context();
                    //Model.CompiledContext compiled = new Model.CompiledContext();
                    //var trees = GetModelsCode();
                    //MemoryStream modelStream = new MemoryStream();
                    //GenerateCode(trees: trees).Emit(modelStream);
                    //modelStream.Seek(0, SeekOrigin.Begin);
                    //compiled.CompiledContext1 = modelStream.ToArray();
                    //Model.Projects project = new Model.Projects();
                    //project.ProjectName = data.ProjName;
                    //project.ContextName = data.ContextName;
                    //project.ConnectionString = data.ConnectionString;
                    //project.OwnerId = context1.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault().Id;
                    //project.Owner = context1.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault();
                    //project.Id = context1.Projects.LastOrDefault()?.Id + 1 ?? 0;
                    //compiled.Id = context1.CompiledContext.LastOrDefault()?.Id + 1 ?? 0;
                    //context1.Add(project);
                    //compiled.Project = project;
                    //compiled.ProjectId = context1.Projects.LastOrDefault(c => c.OwnerId == project.OwnerId)?.Id ?? 0;
                    //context1.Add(compiled);
                    //context1.SaveChanges();

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

        public class Result
        {
            public string resultcode { get; set; }
            public string sql { get; set; }
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