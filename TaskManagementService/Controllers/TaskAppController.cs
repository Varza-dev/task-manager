namespace TaskManagementService.Controllers;

using Microsoft.AspNetCore.Mvc;
using TaskManagementService.Data;
using TaskManagementService.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TaskAppController : ControllerBase
{
    private readonly TaskAppContext _context;
    private const int CURRENT_USER_ID = 1; // Our hardcoded user

    public TaskAppController(TaskAppContext context)
    {
        _context = context;
    }

    // GET: api/todo -- gets list of tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasks(bool includeDeleted = false, int userId = CURRENT_USER_ID)
    {
        var query = _context.ToDoTasks
            .Where(t => t.UserId == userId);

        if (!includeDeleted)
        {
            query = query.Where(t => t.Deleted == false);
        }

        var tasks = await query.OrderByDescending(t => t.UpdatedAt)
            .Select(t => new TaskResponseDto(
                t.TaskId,
                t.Title,
                t.Description,
                t.Status,
                t.CreatedAt,
                t.DueDate
            ))
            .ToListAsync();
        return Ok(tasks);
    }

    // POST: api/todo -- creates new task
    [HttpPost]
    public async Task<ActionResult<TaskResponseDto>> CreateTask(TaskCreateDto taskDto)
    {
        var task = new ToDoTask
        {
            Title = taskDto.Title,
            Description = taskDto.Description,
            Status = ToDoTaskStatus.New,
            DueDate = taskDto.DueDate,
            UserId = 1 // hardcoded for now, this is would come from the auth context in a real system
        };

        _context.ToDoTasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateTask), new { id = task.TaskId }, task);
    }

    // PATCH: api/todo/{id}/status -- support faster partial update to just move a task between statuses
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] TaskStatusUpdateDto newStatus, int userId = CURRENT_USER_ID)
    {
        var task = await _context.ToDoTasks.FindAsync(id);

        if (task == null || task.Deleted == true) return NotFound();

        // security check for your hardcoded user
        if (task.UserId != userId) return Forbid();

        task.Status =  newStatus.NewStatus;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // return the updated task dto
        return Ok(new TaskResponseDto(
            task.TaskId,
            task.Title,
            task.Description,
            task.Status,
            task.CreatedAt,
            task.DueDate
        ));
    }

    // PUT: api/todo/{id}/update -- update a task's title, description, or due date
    [HttpPut("{id}/update")]
    public async Task<ActionResult<TaskResponseDto>> UpdateTaskDetails(int id, [FromBody] TaskUpdateDto taskUpdateDto, int userId = CURRENT_USER_ID)
    {
        var task = await _context.ToDoTasks.FindAsync(id);

        if (task == null || task.Deleted == true) return NotFound();

        // security check
        if (task.UserId != userId) return Forbid();

        // only update the specific fields allowed (enforced by DTO)
        task.Title = taskUpdateDto.Title;
        task.Description = taskUpdateDto.Description;
        task.DueDate = taskUpdateDto.DueDate;

        // always update the audit timestamp
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new TaskResponseDto(
        task.TaskId,
        task.Title,
        task.Description,
        task.Status,
        task.CreatedAt,
        task.DueDate
    ));
    }

    // DELETE: api/todo/{id} -- deletes task with given id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id, int userId = CURRENT_USER_ID)
    {
        var task = await _context.ToDoTasks.FindAsync(id);
        if (task == null) return NotFound();

        if (task.UserId != userId) return Forbid();

        task.Deleted = true;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // RESTORE: api/todo/{id}/restore -- restore a deleted task (to support "undo" operations)
    [HttpPost("{id}/restore")]
    public async Task<IActionResult> RestoreTask(int id, int userId = CURRENT_USER_ID)
    {
        var task = await _context.ToDoTasks.FindAsync(id);
        if (task == null) return NotFound();
        if (task.UserId != userId) return Forbid();
        task.Deleted = false;
        task.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}