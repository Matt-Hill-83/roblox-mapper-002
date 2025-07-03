# CLAUDE.md - Project Instructions Template

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Global Development Preferences

### Code Style & Standards
- **Language**: TypeScript preferred over JavaScript
- **Framework**: [Update based on project - React, Next.js, Vue, etc.]
- **UI Library**: [Update based on project - MUI, Tailwind, etc.]
- **Testing**: [Update based on project - Jest, Vitest, Cypress, etc.]
- **Linting**: ESLint + Prettier configuration

### Development Commands
```bash
# Update these commands for your project
npm run dev        # Development server
npm run build      # Production build
npm run test       # Run tests
npm run lint       # Code linting
npm run typecheck  # TypeScript checking
```

### Architecture Preferences
- **Components**: Functional components with TypeScript
- **State Management**: [Update - Redux, Zustand, Context, etc.]
- **Styling**: [Update - CSS Modules, styled-components, etc.]
- **File Structure**: Feature-based organization
- **API Layer**: [Update - REST, GraphQL, tRPC, etc.]

## Project-Specific Instructions

### Project Overview
[Describe what this project does and its main purpose]

### Key Directories
- `src/`: [Describe source structure]
- `components/`: [Describe component organization]
- `utils/`: [Describe utility functions]
- `types/`: [Describe TypeScript definitions]

### Important Patterns
- [List any specific patterns or conventions for this project]
- [Database schema patterns, naming conventions, etc.]

### Development Workflow
1. [Describe typical development steps]
2. [Testing procedures]
3. [Deployment process]

## File Operations
- **Creating Files**: Always prefer editing existing files over creating new ones
- **Documentation**: Only create documentation files when explicitly requested
- **Commits**: Only commit when explicitly asked

## Image Analysis
- **Image Folder**: `/path/to/project/___images for claude`
- **Instruction**: When asked to "look at the image", examine the most recent image in the images folder

## Task Management
- Use TodoWrite/TodoRead tools for complex multi-step tasks
- Mark tasks as completed immediately upon finishing
- Break down large tasks into smaller, manageable steps

## Error Handling
- Always run linting and type checking after making changes
- Verify tests pass before considering tasks complete
- Handle edge cases and provide meaningful error messages

---

## Setup Instructions

1. Copy this template to your new project:
   ```bash
   cp ~/Projects/templates/CLAUDE.md ./CLAUDE.md
   ```

2. Update the placeholders with project-specific information:
   - Replace [Update based on project] sections
   - Fill in actual development commands
   - Describe your project's specific architecture
   - Update file paths and directory structure

3. Commit the CLAUDE.md file to your repository:
   ```bash
   git add CLAUDE.md
   git commit -m "Add Claude Code instructions"
   ```

## Template Usage

To use this template for a new project:
```bash
# Navigate to your new project
cd /path/to/new/project

# Copy the template
cp ~/Projects/templates/CLAUDE.md ./CLAUDE.md

# Edit the file to match your project
# Update all [placeholder] sections with actual values
```

Remember to customize the template for each project's specific needs while maintaining consistent development practices across projects.