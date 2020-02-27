using Microsoft.EntityFrameworkCore;

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

        public virtual DbSet<CompiledContext> CompiledContext { get; set; }
        public virtual DbSet<Model> Model { get; set; }
        public virtual DbSet<Projects> Projects { get; set; }
        public virtual DbSet<TempProjects> TempProjects { get; set; }
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
            modelBuilder.Entity<CompiledContext>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CompiledContext1).HasColumnName("CompiledContext");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.CompiledContext)
                    .HasForeignKey(d => d.ProjectId)
                    .HasConstraintName("FK__CompiledC__Proje__74AE54BC");
            });

            modelBuilder.Entity<Model>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Filename)
                    .HasColumnName("filename")
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Model1)
                    .HasColumnName("model")
                    .IsUnicode(false);

                entity.Property(e => e.Projectid).HasColumnName("projectid");

                entity.Property(e => e.Tempproject).HasColumnName("tempproject");

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.Model)
                    .HasForeignKey(d => d.Projectid)
                    .HasConstraintName("FK__Model__projectid__7B5B524B");

                entity.HasOne(d => d.TempprojectNavigation)
                    .WithMany(p => p.Model)
                    .HasForeignKey(d => d.Tempproject)
                    .HasConstraintName("FK__Model__tempproje__7A672E12");
            });

            modelBuilder.Entity<Projects>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.ConnectionString)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ContextName)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.OwnerId).HasColumnName("ownerId");

                entity.Property(e => e.ProjectName)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.HasOne(d => d.Owner)
                    .WithMany(p => p.Projects)
                    .HasForeignKey(d => d.OwnerId)
                    .HasConstraintName("FK__Projects__ownerI__73BA3083");
            });

            modelBuilder.Entity<TempProjects>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.ConnectionString)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ContextName)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ProjectName)
                    .HasMaxLength(500)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
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

                entity.Property(e => e.Password)
                    .HasMaxLength(1024)
                    .IsUnicode(false);
            });
        }
    }
}