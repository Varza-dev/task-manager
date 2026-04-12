# Task Management App Frontend

This project was build with TypeScript, React, and Vite. My goal was to build an intuitive, responsive Kanban-board-type interface for viewing and managing tasks.

## Architecture

* **Component Composition**: Used a Container pattern. The `TaskBoard` is the main orchestrator for state and API calls, while interactive components like `TaskCard` and `TaskDetailsModal` focus on UI and user interaction.
* **Data and Callback Management**: Task data and board state are managed at the top level (by `TaskBoard`) to ensure synchronized updates when tasks are modified, created, or deleted.
* **Type Safety**: Used TypeScript interfaces for `Task`, `TaskStatus`, and API DTOs to ensure data consistency between the frontend and the .NET service.
* **Styling**: Centralized CSS definitions in App.css, except for dynamic styles (those had to stay in the component).

## UI Features

* **Drag-and-Drop**: Built using `@dnd-kit` for a smooth, accessible experience. Tasks can be picked up and moved to new lanes to update their status.
* **Real-time Validation**: The `TaskDetailsModal` dynamically disables the save action if requirements (like the task title) are not met.
* **Completion Feedback**: Integrated `canvas-confetti` to provide visual feedback when a user completes a task.
* **Visual Touches**: The task cards have an "underglow" matching the due date's color, using a "stoplight" color scheme to highlight task urgency. The task edit and delete buttons on the card are highlighted when hovered over. 

## Testing Strategy

The project uses **Vitest** and **React Testing Library** for unit testing.

### Main Test Focus
* **Component rendering**: Ensured the components render correctly with data they are given.
* **Correct API calls**: Tested that the correct calls are made from task interactions.


### Testing Trade-offs & Decisions:
* **Decorative Effects**: I made the decision to exclude the confetti animation from the unit test suite. The overhead of mocking the third-party drag-and-drop and confetti libraries and asynchronous interactions proved to be too much (vs the relatively quick implementation time). I verified this feature manually.

## Dependencies

* **React 18** (Functional Components, Hooks)
* **Vite** (Build Tool)
* **TypeScript** (Static Typing)
* **@dnd-kit** (Drag and Drop)
* **Vitest & React Testing Library** (Testing)
* **FontAwesome** (Icons)
* **canvas-confetti** (Confetti animation when completing a task)