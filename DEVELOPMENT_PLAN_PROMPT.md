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

1. Use categorical task identifiers (e.g., SETUP-1, MODEL-2, COMP-3) instead of sequential numbering for maximum flexibility
2. Group tasks by phase and feature area rather than strict hierarchy
3. Git workflow integration including:
   - Branch naming convention (feature/, test/, docs/, etc.)
   - Commit message formats following conventional commits
   - Pull request checkpoints with clear identifiers (e.g., FEAT-PR)
   - Version tagging strategy

4. TDD approach with explicit test-writing steps before implementation
5. Clearly marked milestones with version tags
6. Checkbox format for progress tracking ([  ])

The plan should cover:
- Initial architecture and setup (SETUP-*)
- Core data model implementation (MODEL-*)
- Component/module development following TDD (COMP-*)
- Integration of components (INT-*)
- UI/UX improvements (UI-*)
- Error handling and validation (ERR-*)
- Performance optimization (PERF-*)
- Testing coverage targets (>80%) (TEST-*)
- Documentation requirements (DOC-*)

Format the output as a Markdown file ready to be added to the project repository.
```

## Usage Instructions

1. Replace all placeholder values in [BRACKETS]
2. Submit to your AI assistant
3. Save the generated plan as `DEVELOPMENT_PLAN.md` in your project root
4. Use the plan to track progress by checking boxes as you complete tasks
5. Commit updates to the plan file to maintain a record of progress
6. **Important**: When completing a task, inform the AI with a message like "I've completed COMP-3" or "Task UI-2 is done", and the AI should automatically update the DEVELOPMENT_PLAN.md file by checking the corresponding box

## Task ID Structure

The plan uses categorical task IDs rather than sequential numbering to allow for easy insertion of new tasks:

| Prefix | Category                   | Example |
| ------ | -------------------------- | ------- |
| SETUP  | Initial setup/architecture | SETUP-2 |
| MODEL  | Data model implementation  | MODEL-1 |
| COMP   | UI Component development   | COMP-3  |
| INT    | Integration                | INT-2   |
| UI     | UI enhancements            | UI-1    |
| ERR    | Error handling             | ERR-3   |
| PERF   | Performance optimization   | PERF-2  |
| TEST   | Testing                    | TEST-1  |
| DOC    | Documentation              | DOC-2   |
| MS     | Milestone                  | MS1-3   |
| \*-PR  | Pull Request task          | FEAT-PR |
