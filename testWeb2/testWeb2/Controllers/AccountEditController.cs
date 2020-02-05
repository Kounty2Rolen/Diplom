using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using testWeb2.Model;


namespace testWeb2.Controllers
{
    [Authorize]
    public class AccountInfoController : Controller
    {
        //bool EditPassword(string oldPassword)
        //{ }
        //bool EditFio() { }
        public List<string> GetProjects()
        {
            Context context = new Context();
            List<string> projects = new List<string>();
            int? userid = context.User.Where(c => c.LoginName == User.Identity.Name).Select(c => c.Id).FirstOrDefault();
            if (userid != null)
                foreach (var item in context.Projects.Where(c => c.OwnerId == userid).ToList())
                    projects.Add(item.ProjectName);
            context.Dispose();
            return projects ?? null;
        }

        public Person getInfo() {
            Context context = new Context();
            var user=context.User.Where(c => c.LoginName == User.Identity.Name).FirstOrDefault();
            Person person = new Person();
            person.LoginName = user.LoginName;
            person.Fname = user.Fname;
            person.Mname = user.Mname;
            context.Dispose();
            return person;
        }

    }


}