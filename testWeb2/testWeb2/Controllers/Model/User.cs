using System;
using System.Collections.Generic;

namespace testWeb2.Model
{
    public partial class User
    {
        public User()
        {
            Projects = new HashSet<Projects>();
        }

        public int Id { get; set; }
        public string Fname { get; set; }
        public string Mname { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }

        public ICollection<Projects> Projects { get; set; }
    }
}
