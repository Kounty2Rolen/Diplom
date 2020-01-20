using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication4.DataBase.Models;

namespace WebApplication4.DataBase
{
    public class DataBaseContext:DbContext
    {
        private DbContextOptionsBuilder<DataBaseContext> optionsBuilder;


        public DataBaseContext(DbContextOptions<DataBaseContext> optionsBuilder):base(optionsBuilder)
        {
        }

        public DbSet<Users> Users { get;set; }
         public DbSet<Samples> Samples { get; set; }
    }
}
