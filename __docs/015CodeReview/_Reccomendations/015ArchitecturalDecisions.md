# Architectural Decisions - Entry Points and Controllers

## Overview
This document explains the architectural decisions behind the "orphaned" entry points and controller organization in the Roblox mapper project.

## Entry Point Architecture

### Why main.client.ts and main.server.ts are "Orphaned"

These files are intentionally not imported by any other modules because:

1. **Roblox Execution Model**: Roblox automatically executes scripts based on their location:
   - `main.client.ts` → Compiles to StarterPlayer.StarterPlayerScripts
   - `main.server.ts` → Compiles to ServerScriptService
   
2. **Composition Root Pattern**: These files serve as composition roots where:
   - All dependencies are wired together
   - Services and controllers are instantiated
   - The application is bootstrapped

3. **Single Entry Point**: Having a single entry point per side (client/server) provides:
   - Clear initialization order
   - Centralized dependency management
   - Easier debugging of startup issues

## Controller Architecture

### Client Controllers

Located in `src/client/controllers/`, these follow MVC pattern:

- **Separation of Concerns**: Controllers handle UI logic, services handle business logic
- **Event-Driven**: Controllers respond to user input and server events
- **Memory Management**: Each controller is responsible for cleaning up its connections

### Design Rationale

1. **No Base Controller Class (Yet)**:
   - Current controllers are sufficiently different
   - Premature abstraction avoided
   - Future refactoring can introduce base class when patterns emerge

2. **Direct Service Usage**:
   - Controllers directly instantiate services they need
   - Simple dependency structure
   - Easy to understand and debug

3. **GUI Organization**:
   - Each major feature gets its own controller
   - Controllers manage their entire GUI lifecycle
   - Modular approach allows independent development

## Benefits of This Architecture

1. **Clarity**: Clear entry points make the codebase easier to understand
2. **Testability**: Controllers and services can be tested independently
3. **Maintainability**: Changes to one controller don't affect others
4. **Scalability**: New features can be added as new controllers
5. **Performance**: Only necessary controllers are loaded

## Future Considerations

1. **Controller Base Class**: Implement when common patterns emerge
2. **Dependency Injection**: Consider DI container for complex dependencies
3. **State Management**: Centralized state store if controllers need to share state
4. **Module Federation**: Split large controllers into smaller modules