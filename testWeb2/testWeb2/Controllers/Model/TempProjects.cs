using System.Collections.Generic;

namespace DiplomWork.Model
{
    public partial class TempProjects
    {
        public TempProjects()
        {
            Model = new HashSet<Model>();
        }

        public int Id { get; set; }
        public string ProjectName { get; set; }
        public string ConnectionString { get; set; }
        public string ContextName { get; set; }

        public ICollection<Model> Model { get; set; }
    }
}