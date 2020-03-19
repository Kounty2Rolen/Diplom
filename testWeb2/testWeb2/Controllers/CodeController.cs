using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
using testWeb2.signalrhub;


namespace testWeb2.Controllers
{
    [Authorize]
    [AllowAnonymous]
    public class CodeController : Controller
    {
        string randomEndingForFolder = Guid.NewGuid().ToString().Replace('-', '_');



        //public CodeController(IConnectionManager connectionManager)



        [Route("/Code/ProjectLoad")]
        public IActionResult ProjectLoad([FromBody]string ProjectID)
        {
            if (ProjectID != null)
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
                Project.FileNames = context.Model.Where(c => c.Projectid == projectdb.Id).Select(e => e.Filename).ToList();
                Project.Models = context.Model.Where(c => c.Projectid == projectdb.Id).Select(e => e.Model1).ToList();
                Project.RandomEnding = randomEndingForFolder;
                return Ok(Project);
            }
            else
            {
                return BadRequest();
            }

        }

        [Route("/Code/ModelGenerate")]
        public IActionResult ModelGenerate([FromBody] ConectionData data, string RandomEnding = null)
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
                    string filter = "";
                    if (data.selectedTables.Distinct().Count() <= 0)
                    {
                        filter = "dbo";
                    }
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
                    {"schemaFilters",new string[]{filter} },
                    {"tableFilters",data?.selectedTables.Distinct()??Array.Empty<string>()},
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
            tempproj.FileNames = new List<string>();
            foreach (var file in Directory.GetFiles(path: Path.GetTempPath() + "Model_" + ending))
            {
                testWeb2.Model.Model model = new testWeb2.Model.Model();
                model.Tempproject = tempProject.Id;
                model.Model1 = System.IO.File.ReadAllText(file);
                model.Filename = Path.GetFileName(file);
                model.TempprojectNavigation = tempProject;
                context.Add(model);
                context.SaveChanges();
                tempproj.FileNames.Add(Path.GetFileName(file));
                tempproj.Models.Add(System.IO.File.ReadAllText(file));

            }
            context.SaveChanges();
            tempproj.Id = tempProject.Id;
            tempproj.RandomEnding = ending;
            tempproj.Data = data;
            context.Dispose();
            return tempproj;
        }

    }
    public class Tempproj
    {
        public int Id { get; set; }
        public ConectionData Data { get; set; }
        public List<string> FileNames { get; set; }
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