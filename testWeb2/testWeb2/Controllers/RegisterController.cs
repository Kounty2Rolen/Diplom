using Microsoft.AspNetCore.Mvc;
using System.Linq;
using DiplomWork.Model;

namespace DiplomWork.Controllers
{
    [Route("/[controller]/[action]")]
    public class RegisterController : Controller
    {
        public string RegisterUser([FromBody] Person person)
        {
            Context context = new Context();
            context.User.ToList();
            if (context.User.FirstOrDefault(c => c.LoginName == person.LoginName) == null)
            {
                User newUser = new User();
                newUser.LoginName = person.LoginName;
                newUser.Password = person.Password;
                newUser.Fname = person.Fname;
                newUser.Mname = person.Mname;
                context.Add(newUser);
                context.SaveChanges();
                context.Dispose();
                return "Sucscess";
            }
            return "User already exists!";
        }
    }
}