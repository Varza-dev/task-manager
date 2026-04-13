# Task Management Service

This is the backend for the Task Management App. It provides a RESTful API to manage the lifecycle of tasks, backed by a SQLite persistence layer.

## Project Organization

* **Controllers/**: Controllers handle HTTP communication. Endpoints are implemented here, only one controller for now.
* **Models/**: The database schema definitions used by EF Core.
* **DTO/**: Contains DTO (Data Transfer Object) definitions used for communicating with the front-end.
* **Data/**: Contains the `DbContext` and configuration for the SQLite store.
* **Migrations/**: Automated database schema versioning managed by Entity Framework Core. Excluded from git.

## API Endpoints

| Method     | Endpoint                    | Description                                                            |
|:-----------|:----------------------------|:-----------------------------------------------------------------------|
| **GET**    | `/api/taskapp/tasks`        | Retrieves all tasks.                                                   |
| **POST**   | `/api/taskapp/new`          | Creates a new task. Includes automatic seed data if database is empty. |
| **PUT**    | `/api/taskapp/{id}/update`  | Updates task details (Title, Description, Due Date).                   |
| **PATCH**  | `/api/taskapp/{id}/status`  | Specifically updates a task's status (New, In Progress, Done).         |
| **DELETE** | `/api/taskapp/{id}`         | Performs a logical delete of the task.                                 |
| **PATCH**  | `/api/taskapp/{id}/restore` | Restores a deleted task.                                               |

##  Technical Implementation Details

* **Logical Deletion**: Tasks are not removed from the database immediately. Instead, they are marked with a `deleted` flag to maintain data integrity and allow for potential "undo" features.
* **Seeding**: To display test data in a newly cloned repo, the service automatically seeds the SQLite database with a set of sample tasks if the `Tasks` table is empty on startup.
* **Validation**: Implemented server-side validation to ensure task titles are not empty and due dates are logically sound.

## Testing
The tests are in a separate project, `TaskManagementService.tests`. I implemented unit tests for the CRUD operations, as well as some "negative" tests verifying data protection and expected errors.