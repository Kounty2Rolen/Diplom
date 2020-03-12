using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
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

namespace testWeb2.Controllers
{
    [Authorize]
    [AllowAnonymous]
    public class CodeController : Controller
    {
        [Route("/Code/Index")]
        public IActionResult Index([FromBody]requestData text)
        {
            try
            {
                Tempproj tempproj = null;
                if (text.serializeAnonProj != null)
                {
                    tempproj = JsonConvert.DeserializeObject<Tempproj>(text.serializeAnonProj);
                }
                if (text.ContextName == null)
                {
                    text.ContextName = "Context";
                }
                string codeHead = @"
                                using System;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Infrastructure;
using testWeb2.Model_" + tempproj.RandomEnding + @";
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
        {
            var db = new " + text.ContextName + "();" + @";
            db.GetService<ILoggerFactory>().AddProvider(new MyLoggerProvider());
                ";
                /* var " + "db" + "= new " + text.ContextName + "();" + @"
                    db.GetService<ILoggerFactory>().AddProvider(new MyLoggerProvider());*/

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
                            bld.Append(diagnostic);//StringBuilder more efficient than concat
                        }
                        Result result1 = new Result();
                        result1.resultcode = bld.ToString();
                        return Ok(result1);
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
                                    resultcode += e.Data + "\n";
                                });
                                proc.OutputDataReceived += new DataReceivedEventHandler((sender, e) =>
                                {
                                    sql += e.Data + "\n";
                                });
                                proc.StartInfo.Arguments = User.Identity?.Name ?? Request.HttpContext.TraceIdentifier;
                                proc.StartInfo.WindowStyle = ProcessWindowStyle.Maximized;

                                proc.Start();
                                proc.BeginOutputReadLine();
                                proc.BeginErrorReadLine();
                                NamedPipeServerStream pipeServer = new NamedPipeServerStream("pipeServer" + proc.StartInfo.Arguments, PipeDirection.InOut);
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
                                return result1;
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                        }, cts.Token);
                        newTask.Wait(300000);//Timeout 5 min 300000
                        if (newTask.IsCompleted)
                            return Ok(newTask.Result);
                        else
                        {
                            proc.Kill();
                            cts.Cancel();
                            throw new Exception("TimeOut too long operation");
                        }
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

        static string randomEndingForFolder = Guid.NewGuid().ToString().Replace('-', '_');
        [Route("/Code/ProjectLoad")]
        public IActionResult ProjectLoad([FromBody]string ProjectID)
        {

            var context = new Model.Context();
            var projectdb = context.Projects.Where(c => c.Id == Convert.ToInt32(ProjectID)).FirstOrDefault();
            var Project = new Tempproj();
            Project.Data = new ConectionData()
            {
                ConnectionString = projectdb.ConnectionString,
                ContextName = projectdb.ContextName,
                ProjName = projectdb.ProjectName
            };
            Project.Id = projectdb.Id;
            Project.Models = context.Model.Where(c => c.Projectid == projectdb.Id).Select(e => e.Model1).ToList();
            Project.RandomEnding = randomEndingForFolder;
            return Ok(Project);

        }

        private static List<string> GetModelsCode(Tempproj tempproj)
        {

            List<string> trees = new List<string>();
            tempproj.Models.ForEach(c => trees.Add(c));
            //foreach (var file in Directory.GetFiles(Path.GetTempPath() + "/Model"))
            //{
            //    if (file.Contains(".cs"))
            //    {
            //        using (StreamReader reader = new StreamReader(file.ToString()))
            //        {
            //            trees.Add(reader.ReadToEnd());
            //            tempproj.Models.ForEach(c => trees.Add(c));
            //        }
            //    }
            //}

            return trees;
        }

        private static CSharpCompilation GenerateCode(string sourceCode = null, Tempproj tempproj = null)
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

        public IActionResult ModelGenerate([FromBody] ConectionData data,string RandomEnding=null)
        {
            if (RandomEnding != null)
            {
                randomEndingForFolder = RandomEnding;
            }

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
                    { "outputDir", "Model_"+randomEndingForFolder },
                    {"dbContextClassName",data.ContextName},
                    {"outputDbContextDir","Model_"+randomEndingForFolder},
                    {"schemaFilters",new string[]{""} },
                    {"tableFilters",data?.selectedTables.Distinct()??new List<string>()},
                    {"useDataAnnotations",false },
                    {"overwriteFiles",true },
                    { "useDatabaseNames",true} });
                    context.Execute(new Action(() => { }));
                    var id = new Tempproj();
                    if (User.Identity.IsAuthenticated)
                    {
                        if (data.ProjName == "")
                        {
                            data.ProjName = "TEMP_PROJ_" + randomEndingForFolder;
                        }
                        addProjToUser(data, randomEndingForFolder);
                        id = GenerateTempProject(data, randomEndingForFolder);

                    }
                    else
                    {
                        id = GenerateTempProject(data, randomEndingForFolder);
                    }

                    return Ok(id);
                }
                else
                {
                    return BadRequest("ConnectionString empty");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public void addProjToUser(ConectionData data, string randomEnding)
        {
            Model.Context context = new Model.Context();
            Model.User user = context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault();

            Model.Projects project = new Model.Projects();
            project.Owner = user;
            project.OwnerId = user.Id;
            project.ProjectName = data.ProjName;
            project.ContextName = data.ContextName;
            project.ConnectionString = data.ConnectionString;
            context.Add(project);
            foreach (var file in Directory.GetFiles(path: Path.GetTempPath() + "Model_" + randomEnding))
            {
                Model.Model model = new Model.Model();
                model.Project = project;
                model.Projectid = project.Id;
                model.Model1 = System.IO.File.ReadAllText(file);
                model.Filename = Path.GetFileName(file);
                context.Add(model);
            }
            context.SaveChanges();
            context.Dispose();
        }
        public Tempproj GenerateTempProject(ConectionData data, string ending)
        {
            testWeb2.Model.Context context = new Model.Context();
            Model.TempProjects tempProject = new Model.TempProjects();
            tempProject.ConnectionString = data.ConnectionString;
            tempProject.ContextName = data.ContextName;
            tempProject.ProjectName = data.ProjName;
            Tempproj tempproj = new Tempproj();
            context.Add(tempProject);
            tempproj.Models = new List<string>();
            foreach (var file in Directory.GetFiles(path: Path.GetTempPath() + "Model_" + ending))
            {
                testWeb2.Model.Model model = new testWeb2.Model.Model();
                model.Tempproject = tempProject.Id;
                model.Model1 = System.IO.File.ReadAllText(file);
                model.Filename = Path.GetFileName(file);
                model.TempprojectNavigation = tempProject;
                context.Add(model);
                context.SaveChanges();
                tempproj.Models.Add(System.IO.File.ReadAllText(file));

            }
            context.SaveChanges();
            tempproj.Id = tempProject.Id;
            tempproj.RandomEnding = ending;
            tempproj.Data = data;
            context.Dispose();
            return tempproj;
        }

        public class Tempproj
        {
            public int Id { get; set; }
            public ConectionData Data { get; set; }
            public List<string> Models { get; set; }

            public string RandomEnding { get; set; }
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
            public List<string> selectedTables { get; set; }
        }

        public class requestData
        {
            public string SourceCode { get; set; }
            public string ContextName { get; set; }
            public string serializeAnonProj { get; set; }
        }
    }
}