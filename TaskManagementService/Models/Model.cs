using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagementService.Models;

// "ToDoTaskStatus" to avoid conflict with System.Threading.Tasks.TaskStatus 
public enum ToDoTaskStatus
{
    New,
    InProgress,
    Done
}

public class User
{
    [Key]
    public int UserId { get; set; }
    [Required]
    [MaxLength(30)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    // for iterating though user's tasks
    public virtual ICollection<ToDoTask> Tasks { get; set; } = new List<ToDoTask>();

}

// "Task" is a reserved keyword (System.Threading.Tasks.Task)
public class ToDoTask
{
    [Key]
    public int TaskId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public ToDoTaskStatus Status { get; set; } = ToDoTaskStatus.New;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool Deleted { get; set; } = false;

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }
}
