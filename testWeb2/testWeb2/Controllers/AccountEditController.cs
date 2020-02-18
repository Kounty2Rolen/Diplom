using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using testWeb2.Model;

namespace testWeb2.Controllers
{
    [Authorize]
    public class AccountEditController : Controller
    {
        public IActionResult EditPassword([FromBody] Passwords passwords)
        {
            Context context = new Context();
            string OldPassword = context.User.Where(c => c.LoginName == User.Identity.Name).Select(c => c.Password).FirstOrDefault();

            if (passwords.OldPassword == OldPassword)
            {
                context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault().Password = passwords.NewPassword;
                context.SaveChanges();
                context.Dispose();
                return Ok("Sucscess");
            }
            else
            {
                context.Dispose();
                return BadRequest("Error");
            }
        }

        //bool EditFio() { }
        public List<Projects> GetProjects()
        {
            Context context = new Context();
            List<Projects> projects = new List<Projects>();
            int? userid = context.User.Where(c => c.LoginName == User.Identity.Name).Select(c => c.Id).FirstOrDefault();
            if (userid != null)
                foreach (var item in context.Projects.Where(c => c.OwnerId == userid).ToList())
                    projects.Add(new Projects((int)item.Id, item.ProjectName));
            context.Dispose();
            return projects ?? null;
        }

        public Person getInfo()
        {
            Context context = new Context();

            var user = context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault();
            Person person = new Person();
            person.LoginName = user.LoginName;
            person.Fname = user.Fname;
            person.Mname = user.Mname;
            context.Dispose();
            return person;
        }

        public void PersonEdit([FromBody]Person person)
        {
            Context context = new Context();
            context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault().Mname = person.Mname;
            context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault().Fname = person.Fname;

            context.SaveChanges();
        }
    }

    public class Passwords
    {
        public string NewPassword { get; set; }
        public string OldPassword { get; set; }
    }

    public class Projects
    {
        public Projects(int id, string Name)
        {
            this.id = id;
            this.Name = Name;
        }

        public int id { get; set; }
        public string Name { get; set; }
    }
}