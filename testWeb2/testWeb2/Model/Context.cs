using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace testWeb2.Model
{
    public partial class Context : DbContext
    {
        public Context()
        {
        }

        public Context(DbContextOptions<Context> options)
            : base(options)
        {
        }

        public virtual DbSet<Model> Model { get; set; }
        public virtual DbSet<User> User { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=PYLON\\MSSQLSERVERDEV;Initial Catalog=WebProject;Integrated Security=True");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Model>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Model1)
                    .HasColumnName("Model")
                    .IsUnicode(false);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Fname)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.LoginName)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.Mname)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.ModelIds).HasColumnName("ModelIDs");

                entity.Property(e => e.Password)
                    .HasMaxLength(1024)
                    .IsUnicode(false);

                entity.HasOne(d => d.ModelIdsNavigation)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.ModelIds)
                    .HasConstraintName("FK__Users__ModelIDs__398D8EEE");
            });
        }
    }
}
