﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using Newtonsoft.Json;
using System.Linq;
using System.Collections.Generic;

namespace DiplomWork.Controllers
{
    [Authorize]
    public class ProjectController : Controller
    {
        public IActionResult GetProjectInfo([FromBody]string ProjectID)
        {
            try
            {
                var context = new Model.Context();
                var project = new Project();
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

        public IActionResult RemoveProject([FromBody]int projectID)
        {
            var context = new Model.Context();
            var project = context.Projects.Where(c => c.Id == projectID).FirstOrDefault();
            var models = context.Model.Where(c => c.Projectid == projectID);
            var compiledContext = context.CompiledContext.Where(c => c.ProjectId == projectID).FirstOrDefault();
            if (compiledContext != null)
            {
                context.Remove(compiledContext);
            }
            if (models != null)
            {
                context.RemoveRange(models.AsEnumerable());
            }
            if (project != null)
            {
                context.Remove(project);
            }
            context.SaveChanges();
            context.Dispose();
            return Ok();
        }

        public IActionResult EditModel([FromBody]EditModel tempproj)
        {
            Model.Context context = new Model.Context();
            Model.Model model = context.Model.Where(c => c.Projectid == tempproj.Id).Where(c => c.Filename == tempproj.Filename).FirstOrDefault();
            model.Model1 = tempproj.Model;
            context.SaveChanges();
            return Ok();
        }
        public IActionResult Newproject(Project project)
        {
            var context = new Model.Context();
            var newproject = new Model.Projects();
            newproject.ConnectionString = project.ConnectionString;
            newproject.ContextName = project.Context;
            newproject.ProjectName = project.Name;
            newproject.OwnerId = context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault().Id;

            context.Add(newproject);

            context.SaveChanges();
            return Ok();
        }
    }

    public class EditModel
    {
        public int Id { get; set; }
        public string Filename { get; set; }
        public string Model { get; set; }
    }
    public class Project
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        public string Context { get; set; }
    }
}