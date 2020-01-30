using System;
using System.Collections.Generic;

namespace testWeb2.Model
{
    public partial class Model
    {
        public Model()
        {
            User = new HashSet<User>();
        }

        public int Id { get; set; }
        public string Model1 { get; set; }

        public ICollection<User> User { get; set; }
    }
}
