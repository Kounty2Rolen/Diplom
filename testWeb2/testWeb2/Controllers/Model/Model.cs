namespace DiplomWork.Model
{
    public partial class Model
    {
        public int Id { get; set; }
        public string Filename { get; set; }
        public string Model1 { get; set; }
        public int? Projectid { get; set; }

        public Projects Project { get; set; }
    }
}