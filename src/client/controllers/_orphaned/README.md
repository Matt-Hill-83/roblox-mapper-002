# Orphaned Controllers

This directory contains controllers that are not actively used in the application but are kept for reference or potential future use.

## Purpose

Controllers are moved here when they:
- Are no longer integrated with the main application flow
- Serve as standalone utilities without game integration
- Were created for testing/development but aren't part of core functionality
- May be useful for future reference or reactivation

## Current Contents

### colorPicker.controller.ts
- **Status**: Standalone utility tool
- **Original Purpose**: Color selection interface for developers
- **Functionality**: Creates a GUI for selecting BrickColors and outputs TypeScript color arrays to console
- **Why Orphaned**: Not integrated with any game systems or other controllers
- **Potential Use**: Could be reactivated as a developer tool or integrated with configuration system

## Reactivating Orphaned Controllers

To reactivate a controller:
1. Move it back to the parent controllers directory
2. Update the import path in `main.client.ts`
3. Uncomment the initialization code
4. Ensure any dependencies are still valid
5. Test thoroughly before committing

## Note

Files in this directory are excluded from production builds but retained in version control for historical reference and potential reuse.