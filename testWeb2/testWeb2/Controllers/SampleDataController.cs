using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore.SqlServer.Design;
using System.Diagnostics;





namespace testWeb2.Controllers
{
    //[Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        /// <summary>
        /// ����������� ���
        /// </summary>
        /// <param name="text">��� ������� ���������� ���������</param>
        /// <returns>��������� ���������� ����</returns>
        public string Index([FromBody]requestData text)
        {
            try
            {
                text.text = "return \"hello\";";



                var reportHandler = new OperationReportHandler();
                var resultHandler = new OperationResultHandler();
                var executor = new OperationExecutor(reportHandler, new Dictionary<string, string> { { "targetName", "testWeb2" }, { "startupTargetName", "testWeb2" }, { "projectDir", @"C:\Users\mdm\Desktop\testWeb2\testWeb2" },{"rootNamespace","testWeb2" } });
                var context = new OperationExecutor.ScaffoldContext(executor, resultHandler, new Dictionary<string, object> {
                    {"connectionString", $@"Data Source=pylon\mssqlserverdev; Database=test;Integrated Security=True;" },
                    {"provider", "Microsoft.EntityFrameworkCore.SqlServer"},
                    { "outputDir", "Model" },
                    {"dbContextClassName","DBContext" },
                    {"outputDbContextDir","Model" },
                    {"schemaFilters",new string[0] },
                    {"tableFilters",new string[]{"Samples"} },
                    {"useDataAnnotations",false },
                    {"overwriteFiles",true },
                    { "useDatabaseNames",false} });
                context.Execute(new Action(() => { }));




                string codeHead = @"
                                using System;
                                using System.Diagnostics;
                                using Microsoft.EntityFrameworkCore;
                                using testWeb2.Model;
                                using System.Linq;

                                namespace onfly
                                {
                                 public class TestClass
                                     {
                                    public static void Main(){}
                                    public static string test()
                                       { ";

                string codeFoot = @"}}}";
                string sourceCode = codeHead + text.text + codeFoot;

                using (var peStream = new MemoryStream())
                {
                    var result = GenerateCode(sourceCode).Emit(peStream);



                    if (!result.Success)
                    {
                        string error = "";
                        Console.WriteLine("Compilation done with error.");

                        var failures = result.Diagnostics.Where(diagnostic => diagnostic.IsWarningAsError || diagnostic.Severity == DiagnosticSeverity.Error);

                        foreach (var diagnostic in failures)
                        {
                            error += "\n" + diagnostic.ToString();
                        }
                        return error;
                    }
                    Console.WriteLine("Compilation done without any error.");

                    peStream.Seek(0, SeekOrigin.Begin);
                    var assebly = Assembly.Load(peStream.ToArray());
                    var instance = assebly.CreateInstance("onfly.TestClass");
                    //DbContext[] dbs = { context};

                    var resultOut = assebly.GetType("onfly.TestClass").GetMethod("test").Invoke(instance, null).ToString();
                    return resultOut;

                }



                //var compiler = CodeDomProvider.CreateProvider("CSharp");
                //var parameters = new CompilerParameters
                //{
                //    CompilerOptions = "/t:library",
                //    GenerateInMemory = true,
                //    IncludeDebugInformation = false
                //};
                //var compilerResults = compiler.CompileAssemblyFromSource(parameters, sourceCode);

                //if (compilerResults.Errors.Capacity > 0)
                //{
                //    foreach (var r in compilerResults.Errors)
                //    {
                //        errors = errors + " " + r.ToString();
                //    }
                //    return errors;
                //}
                //var instance = compilerResults.CompiledAssembly.CreateInstance("onfly.TestClass");

                //string result = compilerResults.CompiledAssembly.GetType("onfly.TestClass").GetMethod("main").Invoke(instance, null).ToString();
                //return text1;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
        /// <summary>
        /// ���������� ��� � ������
        /// </summary>
        /// <param name="sourceCode">�������� ��� ���������� </param>
        /// <returns></returns>
        private static CSharpCompilation GenerateCode(string sourceCode)
        {
            var codeString = SourceText.From(sourceCode);
            var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.Latest);
            var assebly = AppDomain.CurrentDomain.GetAssemblies();
            var parsedSyntaxTree = SyntaxFactory.ParseSyntaxTree(codeString, options);
            var references = new MetadataReference[]
            {

                MetadataReference.CreateFromFile(assebly.First(c=>c.FullName.StartsWith("netstandard")).Location),
                //MetadataReference.CreateFromFile(assebly.First(c=>c.FullName.StartsWith("mscorelib")).Location),
                //MetadataReference.CreateFromFile(@"C:\Program Files\dotnet\sdk\3.1.100\Microsoft\Microsoft.NET.Build.Extensions\net461\lib\netstandard.dll"),
                MetadataReference.CreateFromFile(typeof(System.Linq.Enumerable).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Linq.Expressions.BinaryExpression).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(RelationalDatabaseFacadeExtensions).Assembly.Location),
                //MetadataReference.CreateFromFile(typeof(testWeb2.Model.Context).Assembly.Location),
                //MetadataReference.CreateFromFile(typeof(testWeb2.Model.Temp).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.ComponentModel.TypeConverter).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(DbContext).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.ComponentModel.IComponent).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Process).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Runtime.AssemblyTargetedPatchBandAttribute).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo).Assembly.Location),
            };
            return CSharpCompilation.Create("Hello.dll",
                new[] { parsedSyntaxTree },
                references: references,
                options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary,
                    optimizationLevel: OptimizationLevel.Release,
                    assemblyIdentityComparer: DesktopAssemblyIdentityComparer.Default));
        }
        public class requestData
        {
            public string text { get; set; }
        }
    }
}