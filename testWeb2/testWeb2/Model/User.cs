using System;
using System.Collections.Generic;

namespace testWeb2.Model
{
    public partial class User
    {
        public int Id { get; set; }
        public string Fname { get; set; }
        public string Mname { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }
        public int? ModelIds { get; set; }

        public Model ModelIdsNavigation { get; set; }
    }
}
