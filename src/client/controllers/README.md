# Client Controllers

This directory contains client-side GUI controllers for the Roblox mapper application.

## Architecture

Controllers in this directory follow the Model-View-Controller (MVC) pattern:
- **Controllers**: Handle user input and coordinate between services and views
- **Services**: Provide business logic and data management
- **Views**: GUI components created using Roblox's GUI system

## Controllers

### Active Controllers

1. **configGUI.controller.ts**
   - Main configuration interface for the graph visualization
   - Allows users to modify layers, nodes, spacing, and visual settings
   - Communicates with server via RemoteEvents

2. **animationTestGUI.controller.ts**
   - Test interface for animation features
   - Provides controls for testing graph animations
   - Used for development and debugging

3. **colorPicker.controller.ts**
   - Color selection interface
   - Allows users to customize node and link colors
   - Integrates with the main configuration GUI

## Entry Points

Controllers are initialized from `main.client.ts`, which serves as the client-side entry point. This file is intentionally "orphaned" (not imported by other modules) because it's automatically executed by Roblox when placed in StarterPlayer.StarterPlayerScripts.

## Design Patterns

1. **Singleton Pattern**: Most controllers are implemented as singletons to ensure only one instance exists
2. **Observer Pattern**: Controllers listen for RemoteEvents from the server
3. **Dependency Injection**: Services are injected into controllers for loose coupling

## Best Practices

When creating new controllers:
1. Extend from a base controller class if implementing common functionality
2. Properly clean up event connections to prevent memory leaks
3. Use TypeScript interfaces for type safety
4. Document public methods and complex logic
5. Follow the existing naming convention: `[feature].controller.ts`