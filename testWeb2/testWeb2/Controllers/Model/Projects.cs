using System.Collections.Generic;

namespace DiplomWork.Model
{
    public partial class Projects
    {
        public Projects()
        {
            CompiledContext = new HashSet<CompiledContext>();
            Model = new HashSet<Model>();
        }

        public int Id { get; set; }
        public string ProjectName { get; set; }
        public string ConnectionString { get; set; }
        public string ContextName { get; set; }
        public int? OwnerId { get; set; }

        public User Owner { get; set; }
        public ICollection<CompiledContext> CompiledContext { get; set; }
        public ICollection<Model> Model { get; set; }
    }
}