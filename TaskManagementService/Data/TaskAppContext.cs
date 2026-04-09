namespace TaskManagementService.Data;

using TaskManagementService.Models;
using Microsoft.EntityFrameworkCore;

public class TaskAppContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<ToDoTask> ToDoTasks { get; set; }

    public string DbPath { get; }

    public TaskAppContext(DbContextOptions<TaskAppContext> options) : base(options)
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = Path.Join(path, "task_app.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // make sure this primary key exists to avoid EF build issues
        modelBuilder.Entity<ToDoTask>().HasKey(t => t.TaskId);

        modelBuilder.Entity<ToDoTask>()
            .Property(t => t.Status)
            .HasConversion<string>();
    }
}