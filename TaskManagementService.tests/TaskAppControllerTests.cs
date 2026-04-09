// This was odd to me, I had to add these imports or the tests would not find the classes (like TaskAppContext)
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

using TaskManagementService.Controllers;
using TaskManagementService.Data;
using TaskManagementService.Models;

namespace TaskManagementService.Tests;

public class ToDoTests
{
    private TaskAppContext GetDatabase()
    {
        var options = new DbContextOptionsBuilder<TaskAppContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new TaskAppContext(options);
    }

    // ----- positive CRUD API tests -----
    [Fact]
    public async Task Test_Task_Create()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);
        var createTaskDto = new TaskCreateDto(
            Title: "Spin around",
            Description: "in circles",
            DueDate: null
        );

        // Do the thing
        var result = await controller.CreateTask(createTaskDto);

        // Verify
        var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);

        // Verify the database now contains 1 task
        Assert.Equal(1, await context.ToDoTasks.CountAsync());

        // Verify the data in the DB matches what we sent
        var taskInDb = await context.ToDoTasks.FirstOrDefaultAsync();
        Assert.NotNull(taskInDb);
        Assert.Equal("Spin around", taskInDb.Title);
        Assert.Equal("in circles", taskInDb.Description);
    }

    [Fact]
    public async Task Test_Task_Status_Update()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);
        var task = new ToDoTask { TaskId = 1, Title = "Get almond milk", Status = ToDoTaskStatus.New, UserId = 1 };
        context.ToDoTasks.Add(task);
        await context.SaveChangesAsync();
        var updateDto = new TaskStatusUpdateDto(
            ToDoTaskStatus.InProgress
        );

        // Do the thing
        var result = await controller.UpdateStatus(1, updateDto);

        // Verify
        Assert.IsType<OkObjectResult>(result);
        var updated = await context.ToDoTasks.FindAsync(1);
        Assert.Equal(ToDoTaskStatus.InProgress, updated?.Status);
    }

    [Fact]
    public async Task Test_Task_Details_Update()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);

        // Create an initial tas;
        var existingTask = new ToDoTask
        {
            TaskId = 1,
            Title = "Initial Title",
            Description = "Initial Description",
            UserId = 1
        };
        context.ToDoTasks.Add(existingTask);
        await context.SaveChangesAsync();

        // create an update DTO with new details
        var updateDto = new TaskUpdateDto(
            "Updated Title",
            "Updated Description",
            DateTime.UtcNow.AddDays(1)
        );

        // Do the thing
        var result = await controller.UpdateTaskDetails(1, updateDto);

        // Verify
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<TaskResponseDto>(okResult.Value);

        // response content
        Assert.Equal("Updated Title", response.Title);
        Assert.Equal("Updated Description", response.Description);
        Assert.NotNull(response.DueDate);

        // database
        var taskInDb = await context.ToDoTasks.FindAsync(1);
        Assert.NotNull(taskInDb);
        Assert.Equal("Updated Title", taskInDb.Title);
        Assert.Equal("Updated Description", taskInDb.Description);
    }

    [Fact]
    public async Task Test_Task_Delete()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);
        var task = new ToDoTask { TaskId = 5, Title = "Delete Me", UserId = 1 };
        context.ToDoTasks.Add(task);
        await context.SaveChangesAsync();

        // Do the thing
        var result = await controller.DeleteTask(5);

        // Verify
        Assert.IsType<NoContentResult>(result);
        var deletedTask = await context.ToDoTasks.FindAsync(5);
        // the task is not deleted from the database, but has a "deleted" flag set to true
        Assert.NotNull(deletedTask);
        Assert.True(deletedTask.Deleted);
    }

    [Fact]
    public async Task Test_RestoreTask()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);
        var taskId = 10;
        var task = new ToDoTask
        {
            TaskId = taskId,
            UserId = 1, // Matches CURRENT_USER_ID
            Deleted = true,
            UpdatedAt = DateTime.MinValue
        };
        context.ToDoTasks.Add(task);
        await context.SaveChangesAsync();

        // Do the thing
        var result = await controller.RestoreTask(taskId);

        // Verify
        Assert.IsType<NoContentResult>(result);

        var updatedTask = await context.ToDoTasks.FindAsync(taskId);
        Assert.NotNull(updatedTask);
        Assert.False(updatedTask.Deleted);
        // Verify the recent update
        Assert.True(updatedTask.UpdatedAt > DateTime.UtcNow.AddSeconds(-5));
    }

    // ---- negative or protection tests ------
    [Fact]
    public async Task Test_Only_Owner_Can_Update_Status()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);

        var task = new ToDoTask { TaskId = 1, Title = "Private Stuff", UserId = 99 };
        context.ToDoTasks.Add(task);
        await context.SaveChangesAsync();

        var updateDto = new TaskStatusUpdateDto(
            ToDoTaskStatus.InProgress
        );

        // Do the thing
        var result = await controller.UpdateStatus(1, updateDto);

        // Verify
        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Test_Update_NonExistent_Task()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);

        // No data is inserted, so no task will exist
        var updateDto = new TaskUpdateDto("Title", "Description", null);

        // Do the thing
        var result = await controller.UpdateTaskDetails(999, updateDto);

        // Verify 404 error
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Test_RestoreTask_NotFound()
    {
        // Set up (no tasks, actually)
        var context = GetDatabase();
        var controller = new TaskAppController(context);
        var result = await controller.RestoreTask(999);

        // Verify
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Test_RestoreTask_Forbidden()
    {
        // Set up
        var context = GetDatabase();
        var controller = new TaskAppController(context);
        var taskId = 20;
        var task = new ToDoTask { TaskId = taskId, UserId = 99, Deleted = true };
        context.ToDoTasks.Add(task);
        await context.SaveChangesAsync();

        // Do the thing
        var result = await controller.RestoreTask(taskId);

        // Verify
        Assert.IsType<ForbidResult>(result);

        // Ensure the task is still deleted
        var checkTask = await context.ToDoTasks.FindAsync(taskId);
        Assert.NotNull(checkTask);
        Assert.True(checkTask.Deleted);
    }
}