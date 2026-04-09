namespace TaskManagementService.Models;

public record TaskUpdateDto(
    string Title,
    string? Description,
    DateTime? DueDate
);