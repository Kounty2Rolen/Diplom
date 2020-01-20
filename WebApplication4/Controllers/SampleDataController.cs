using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;
using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        public string Index([FromBody]requestData text)
        {
            try
            {
                string codeHead = @"
                                using System;
                                namespace onfly
                                {
                                 public class TestClass
                                     {
public static void Main(){}
                                    public static string test()
                                       { ";
                string codeFoot = @"}}}";
                string sourceCode = codeHead + text.text + codeFoot;
                string errors = "";

                using (var peStream = new MemoryStream())
                {
                    var result = GenerateCode(sourceCode).Emit(peStream);

                    if (!result.Success)
                    {
                        Console.WriteLine("Compilation done with error.");

                        var failures = result.Diagnostics.Where(diagnostic => diagnostic.IsWarningAsError || diagnostic.Severity == DiagnosticSeverity.Error);

                        foreach (var diagnostic in failures)
                        {
                            Console.Error.WriteLine("{0}: {1}", diagnostic.Id, diagnostic.GetMessage());
                        }

                        return null;
                    }

                    Console.WriteLine("Compilation done without any error.");

                    peStream.Seek(0, SeekOrigin.Begin);

                    var assebly = Assembly.Load(peStream.ToArray());
                    var instance = assebly.CreateInstance("onfly.TestClass");
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

        private static CSharpCompilation GenerateCode(string sourceCode)
        {
            var codeString = SourceText.From(sourceCode);
            var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.CSharp7_3);

            var parsedSyntaxTree = SyntaxFactory.ParseSyntaxTree(codeString, options);

            var references = new MetadataReference[]
            {
                MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(System.Runtime.AssemblyTargetedPatchBandAttribute).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo).Assembly.Location),
            };

            return CSharpCompilation.Create("Hello.dll",
                new[] { parsedSyntaxTree },
                references: references,
                options: new CSharpCompilationOptions(OutputKind.ConsoleApplication,
                    optimizationLevel: OptimizationLevel.Release,
                    assemblyIdentityComparer: DesktopAssemblyIdentityComparer.Default));
        }

        public class requestData
        {
            public string text { get; set; }
        }
    }
}