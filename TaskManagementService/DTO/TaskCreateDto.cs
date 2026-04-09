namespace TaskManagementService.Models;

public record TaskCreateDto(
    string Title,
    string? Description = null, 
    DateTime? DueDate = null
);