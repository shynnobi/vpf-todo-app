# User Flows - Todo Application

This document describes the primary user flows in the Todo application, represented as diagrams.

## Core User Flows

### 1. Task Management Flow

```mermaid
flowchart TD
    A[Landing Page] --> B{Has Tasks?}
    B -->|Yes| C[View Task List]
    B -->|No| D[Show Empty State]
    D --> E[Add New Task]
    C --> F[Select Task]
    F --> G{Action?}
    G -->|Mark Complete| H[Update Task Status]
    G -->|Edit| I[Edit Task]
    G -->|Delete| J[Delete Task]
    G -->|Add Due Date| K[Set Due Date]
    G -->|Set Priority| L[Update Priority]
    H --> M[Save to LocalStorage]
    I --> M
    J --> M
    K --> M
    L --> M
    M --> C
    E --> M
```

### 2. Task Creation Flow

```mermaid
flowchart TD
    A[User Types Task Title] --> B[Submit Task]
    B --> C{Valid Title?}
    C -->|Yes| D[Create New Task]
    C -->|No| E[Show Validation Error]
    D --> F[Add to Task List]
    F --> G[Clear Input Field]
    G --> H[Show Success Notification]
    E --> A
```

### 3. Task Filtering Flow

```mermaid
flowchart TD
    A[View All Tasks] --> B{Select Filter}
    B -->|All| C[Show All Tasks]
    B -->|Active| D[Show Incomplete Tasks]
    B -->|Completed| E[Show Completed Tasks]
    C --> F[Update Filter Indicator]
    D --> F
    E --> F
    F --> G[Store Filter Preference]
```

### 4. Task Editing Flow

```mermaid
flowchart TD
    A[Select Task to Edit] --> B[Enter Edit Mode]
    B --> C[Modify Task Title]
    C --> D{Submit Changes}
    D -->|Confirm| E{Valid Title?}
    D -->|Cancel| F[Exit Edit Mode]
    E -->|Yes| G[Update Task]
    E -->|No| H[Show Validation Error]
    G --> I[Exit Edit Mode]
    G --> J[Save Changes]
    H --> C
    F --> A
    J --> K[Update UI]
```

### 5. Theme Toggle Flow

```mermaid
flowchart TD
    A[User Views App] --> B{Check System Preference}
    B -->|Light| C[Use Light Theme]
    B -->|Dark| D[Use Dark Theme]
    C --> E[User Clicks Theme Toggle]
    D --> E
    E --> F{Current Theme}
    F -->|Light| G[Switch to Dark Theme]
    F -->|Dark| H[Switch to Light Theme]
    G --> I[Save Preference]
    H --> I
    I --> J[Apply Theme Changes]
```

## Advanced User Flows

### 6. Priority Management Flow

```mermaid
flowchart TD
    A[Select Task] --> B[Open Priority Menu]
    B --> C{Select Priority}
    C -->|High| D[Set High Priority]
    C -->|Medium| E[Set Medium Priority]
    C -->|Low| F[Set Low Priority]
    D --> G[Update Visual Indicator]
    E --> G
    F --> G
    G --> H[Save Changes]
    H --> I[Update Task List]
```

### 7. Due Date Management Flow

```mermaid
flowchart TD
    A[Select Task] --> B[Open Date Picker]
    B --> C[Select Due Date]
    C --> D[Save Due Date]
    D --> E[Update Task with Due Date]
    E --> F[Recalculate Task Status]
    F -->|Overdue| G[Mark as Overdue]
    F -->|Upcoming| H[Show Due Soon]
    G --> I[Update Task List]
    H --> I
```
