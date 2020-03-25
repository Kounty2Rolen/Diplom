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
using DiplomWork.signalrhub;
using DiplomWork.Classes;
using Microsoft.EntityFrameworkCore.Scaffolding;

namespace DiplomWork.Controllers
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
                context.Dispose();
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
                if (string.IsNullOrEmpty(value: data.ContextName))
                {
                    data.ContextName = "Context";
                }

                if (!string.IsNullOrEmpty(data.ConnectionString))
                {
                    string filter = "";
                    if (!data.selectedTables.Distinct().Any())
                    {
                        filter = "dbo";
                    }


                    var models = CustomReverseEngineerScaffolder.ScaffoldContext(
                        provider: "Microsoft.EntityFrameworkCore.SqlServer",
                        connectionString: data.ConnectionString,
                        outputDir: Path.GetTempPath() + "Model_" + randomEndingForFolder,
                        outputContextDir: Path.GetTempPath() + "Model_" + randomEndingForFolder,
                        dbContextClassName: data.ContextName,
                        schemas: new string[] { filter },
                        tables: data?.selectedTables.Distinct() ?? Array.Empty<string>(),
                        useDataAnnotations: false,
                        overwriteFiles: true,
                        useDatabaseNames: true
                        );

                    var TempProj = new Tempproj();

                    if (User.Identity.IsAuthenticated)
                    {
                        if (data.ProjName == "")
                        {
                            data.ProjName = "TEMP_PROJ_" + randomEndingForFolder;
                        }
                        addProjToUser(data, models);
                        TempProj.Models = models.AdditionalFiles.Select(c => c.Code).ToList();
                        TempProj.Models.Add(models.ContextFile.Code);
                        TempProj.FileNames = models.AdditionalFiles.Select(c => Path.GetFileName(c.Path)).ToList();
                        TempProj.FileNames.Add(Path.GetFileName(models.ContextFile.Path));
                    }
                    else
                    {
                        TempProj = GenerateTempProject(data, randomEndingForFolder,models);
                    }

                    return Ok(TempProj);
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

        public  void addProjToUser(ConectionData data, ScaffoldedModel models)
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
            foreach (var file in models.AdditionalFiles)
            {
                Model.Model model = new Model.Model();
                model.Project = project;
                model.Projectid = project.Id;
                model.Model1 = file.Code;
                model.Filename = Path.GetFileName(file.Path);
                context.Add(model);
            }
            Model.Model ContextModel = new Model.Model();
            ContextModel.Project = project;
            ContextModel.Projectid = project.Id;
            ContextModel.Model1 = models.ContextFile.Code;
            ContextModel.Filename = Path.GetFileName(models.ContextFile.Path);
            context.Add(ContextModel);
            context.SaveChanges();
            context.Dispose();
        }
        public  Tempproj GenerateTempProject(ConectionData data, string ending, ScaffoldedModel models)
        {
            DiplomWork.Model.Context context = new Model.Context();
            Model.TempProjects tempProject = new Model.TempProjects();
            tempProject.ConnectionString = data.ConnectionString;
            tempProject.ContextName = data.ContextName;
            tempProject.ProjectName = data.ProjName;
            Tempproj tempproj = new Tempproj();
            context.Add(tempProject);
            tempproj.Models = new List<string>();
            tempproj.FileNames = new List<string>();
            foreach (var file in models.AdditionalFiles)
            {
                DiplomWork.Model.Model model = new DiplomWork.Model.Model();
                model.Tempproject = tempProject.Id;
                model.Model1 = file.Code;
                model.Filename = Path.GetFileName(file.Path);
                model.TempprojectNavigation = tempProject;
                context.Add(model);
                context.SaveChanges();
                tempproj.FileNames.Add(Path.GetFileName(file.Path));
                tempproj.Models.Add(file.Code);
            }
            tempproj.FileNames.Add(Path.GetFileName(models.ContextFile.Path));
            tempproj.Models.Add(models.ContextFile.Code);
            DiplomWork.Model.Model Contextmodel = new DiplomWork.Model.Model();
            Contextmodel.Tempproject = tempProject.Id;
            Contextmodel.Model1 = models.ContextFile.Code;
            Contextmodel.Filename = Path.GetFileName(models.ContextFile.Path);
            context.Add(Contextmodel);

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