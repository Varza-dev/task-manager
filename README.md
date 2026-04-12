## Task Management System

## Overview
This is a simple task management system with a backend ([TaskManagementService](./TaskManagementService/README.md)) and front-end ([TaskManagementFrontEnd](./TaskManagementFrontEnd/README.md)) components. I was inspired by Airtable, where I have a Kanban board set up to track my job search tasks, as well as by Asana and Jira, which I have used throughout my career.

---

## Setup and Running the App

### 1. Backend
**Prerequisites:**
* .NET 10.0 SDK
* Entity Framework Tools (`dotnet tool install --global dotnet-ef`)

This project uses SQLite for local development. By default, the database will be created as `task_app.db` in the Service folder.

**From the main repo directory:**
```bash
cd TaskManagementService
# Initialize the database
dotnet ef database update
# Restore dependencies
dotnet restore
# Build the project
dotnet build
# Run the server
dotnet run
```
The service will run on `http://localhost:5085` (this is defined in [launchSettings.json](./TaskManagementService/Properties/launchSettings.json))

Service tests:
```bash
cd TaskManagementService.tests
# Restore dependencies
dotnet restore
# Build the project
dotnet build
# Run the tests
`dotnet test`
```

### 2. Front-end
**Prerequisites:**
* Node.js
* npm

The project uses React and Vite.

**From the main repo directory:**
```bash
cd TaskManagementFrontEnd`
# Install dependencies
npm install
# Start the dev environment:
npm run dev
```

The app will run at `http://localhost:5173/` (the default Vite configuration)

To run the Vitest suite:
```bash
npm test
```

# Scope and Assumptions
To ensure simplicity and reliability, I set the following boundaries on scope:
* **Single-user focus**: I built a single-user environment in this version. I considered authentication (AuthN) and Authorization (AuthZ) to be out of scope. I only focused on the task management lifecycle and on persisting state locally.
* **Single board**: I assumed that a single, dedicated board is sufficient for demoing this workflow. I have omitted support for multiple configurable task boards or workspaces.
* **Local dev environment**: I designed this project to run in a local development environment. Assumptions are: a local SQLite Database (set up using EFCode), .NET 10 and a Node.js and npm environment on the target machine.

# Scaling, Trade-offs
* **Simplicity vs High Scale**: I chose the single-board implementation to reduce complexity in the databse schema and front-end implementation (removed the need to use a Router or redirects)
* **In-memory UI vs Server-Side rendering**: I am using client-side rendering exclusively. While this means the js bundle is larger, it allows for smooth UI interactions (and drag and drop)
* **Database**: this app is using a very small local SQLite database (set up and managed with EFCore). In a production system, we could expect both higher traffic and much more data, so I would use a cloud database service, as well as a more scalable service architecture and deployment (i.e. run on a fleet, using load balancing and/or API gateways)

# Future Work
While the current version showcases task management, I have identified several areas for future development neede to transform this into a full-fledged production system:
* **Authentication and Authorization**: Integrate with an identity system to build user registration and secure login. (options are ASP.NET Core Identity or Auth0)
* **Multiple/Customizable Task Boards**: Allow users to build different boards for different projects. This requires a major update to the database schema. Provide more than one board design (like Airtable does)
* **Personalized Data**: Build user-specific data silos, ensuring users only see and interact with their own boards.
* **Accessibility and Inclusive Design**: I chose the color palette for my own "fun" rather than accessibility compliance (stoplight colors are not color-blind friendly). An actual production app should comply with accessibility guidelines, allowing for high-contrast, large size, and color-blind-friendly color configurations.
* **Keyboard Navigation**: Enable keyboard navigation and screen reading for users who rely on assistive technologies.
* **System Scaling and Persistence**: Move to managed cloud databases for increased scale and availability. Enable the service to run on a fleet with load balancers and API gateways. Regionalize deployment if needed for new markets.
* **Support real-time collaboration**: Allow for board sharing and real-time updates to support the app across multiple devices or enable collaboration for users.