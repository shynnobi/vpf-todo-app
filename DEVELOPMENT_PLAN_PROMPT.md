# Development Plan Generator Prompt

Use this prompt at the beginning of a new project to generate a structured development plan with TDD and Git workflow integration.

```
As a technical software architect specializing in TDD and Git workflow best practices, create a comprehensive development plan for a new project with the following specifications:

Project name: [PROJECT_NAME]
Project type: [PROJECT_TYPE e.g., web app, mobile app, API]
Core technologies: [TECHNOLOGIES e.g., React, TypeScript, Zustand]
Key features:
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]
...

Please structure the development plan with the following elements:

1. A hierarchical numbered task list (1.1, 1.1.1, etc.) for clear reference
2. Git workflow integration including:
   - Branch naming convention (feature/, test/, docs/, etc.)
   - Commit message formats following conventional commits
   - Pull request checkpoints
   - Version tagging strategy

3. TDD approach with explicit test-writing steps before implementation
4. Clearly marked milestones with version tags
5. Checkbox format for progress tracking ([  ])

The plan should cover:
- Initial architecture and setup
- Core data model implementation
- Component/module development following TDD
- Integration of components
- UI/UX improvements
- Performance optimization
- Testing coverage targets (>80%)
- Documentation requirements

Format the output as a Markdown file ready to be added to the project repository.
```

## Usage Instructions

1. Replace all placeholder values in [BRACKETS]
2. Submit to your AI assistant
3. Save the generated plan as `DEVELOPMENT_PLAN.md` in your project root
4. Use the plan to track progress by checking boxes as you complete tasks
5. Commit updates to the plan file to maintain a record of progress
6. **Important**: When completing a task, inform the AI with a message like "I've completed task 2.1.1" or "Task 2.1.1 is done", and the AI should automatically update the DEVELOPMENT_PLAN.md file by checking the corresponding box
