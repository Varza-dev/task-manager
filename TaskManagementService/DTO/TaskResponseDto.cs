namespace TaskManagementService.Models;

public record TaskResponseDto(
    int TaskId,
    string Title,
    string? Description,
    ToDoTaskStatus Status,
    DateTime CreatedAt,
    DateTime? DueDate,
    bool Deleted = false
);