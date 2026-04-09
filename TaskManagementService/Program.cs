using Microsoft.EntityFrameworkCore;
using TaskManagementService.Models;
using TaskManagementService.Data;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// add controller services
builder.Services.AddControllers();

// set up Swagger for manual backend testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// register with SQLite
builder.Services.AddDbContext<TaskAppContext>(options => options.UseSqlite(connectionString));

// CORS policy to allow the React frontend, running on the default Vite port, to access the APIs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173") // Vite default port
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Database initialization and population with test data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = scope.ServiceProvider.GetRequiredService<TaskAppContext>();
    // this is where migration logic would go
    db.Database.EnsureCreated(); // Use this for a simple "no-migration" demo

    if (!db.Users.Any())
    {
        var testUser = new User
        {
            UserId = 1, 
            UserName = "TestUser",
            PasswordHash = "hashed_password"
        };

        db.Users.Add(testUser);

        db.ToDoTasks.AddRange(
            new ToDoTask { 
                Title = "Get groceries", 
                Description = "Don't forget the almond milk", 
                Status = ToDoTaskStatus.New, 
                UserId = 1 
            },
            new ToDoTask { 
                Title = "Wash car", 
                Description = "You have to drive it no matter how close the car wash is...", 
                Status = ToDoTaskStatus.InProgress, 
                UserId = 1 
            },
            new ToDoTask { 
                Title = "Buy gas", 
                Description = "As we march beyond the light, I feel no greater thrill", 
                Status = ToDoTaskStatus.Done, 
                UserId = 1 
            }
        );
        db.SaveChanges();
    }
}

// configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Apply the CORS policy
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();