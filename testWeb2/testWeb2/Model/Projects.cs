using System;
using System.Collections.Generic;

namespace testWeb2.Model
{
    public partial class Projects
    {
        public Projects()
        {
            CompiledContext = new HashSet<CompiledContext>();
        }

        public int Id { get; set; }
        public string ProjectName { get; set; }
        public string ConnectionString { get; set; }
        public string ContextName { get; set; }
        public int? OwnerId { get; set; }

        public User Owner { get; set; }
        public ICollection<CompiledContext> CompiledContext { get; set; }
    }
}
