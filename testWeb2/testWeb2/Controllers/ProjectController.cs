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
                return Ok(project);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public IActionResult Newproject(string PrjName, string DbModel)
        { return Ok(); }
    }

    internal class Project
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public string Context { get; set; }
    }
}