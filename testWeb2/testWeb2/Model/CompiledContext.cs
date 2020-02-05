using System;
using System.Collections.Generic;

namespace testWeb2.Model
{
    public partial class CompiledContext
    {
        public int Id { get; set; }
        public int? ProjectId { get; set; }
        public byte[] CompiledContext1 { get; set; }

        public Projects Project { get; set; }
    }
}
