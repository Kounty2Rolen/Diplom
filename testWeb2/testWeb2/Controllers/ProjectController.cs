using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace testWeb2.Controllers
{
    [Authorize]
    public class ProjectController : Controller
    {
        public IActionResult GetProjectInfo([FromBody]string ProjectID)
        {
            try
            {
                Model.Context context = new Model.Context();
                Project project = new Project();
                var projectdb = context.Projects.Where(c => c.Id == Convert.ToInt32(ProjectID)).FirstOrDefault();
                project.Name = projectdb.ProjectName;
                project.ConnectionString = projectdb.ConnectionString;
                project.Context = projectdb.ContextName;
                return Ok(project);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public IActionResult Newproject(Project project)
        {
            Model.Context context = new Model.Context();
            Model.Projects newproject = new Model.Projects();
            newproject.ConnectionString = project.ConnectionString;
            newproject.ContextName = project.Context;
            newproject.ProjectName = project.Name;
            newproject.OwnerId = context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault().Id;

            context.Add(newproject);

            context.SaveChanges();
            return Ok();
        }
    }

    public class Project
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public string Context { get; set; }
    }
}