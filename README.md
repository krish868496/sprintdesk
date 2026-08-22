# SprintDesk

A production-oriented sprint management dashboard built with React, TypeScript, TanStack Query, Zustand, Tailwind CSS, and @dnd-kit.

SprintDesk provides a Kanban-style workspace for managing sprint tasks, tracking progress, and analyzing sprint data.

## Live Demo

## Demo Login

Username: `emilys`
Password: `emilyspass`

🔗 Live Application: [YOUR_VERCEL_URL](https://sprintdesk-alpha.vercel.app/login)

---

## Features

### Authentication

- Login using DummyJSON authentication API
- Protected application routes
- Redirect unauthenticated users to `/login`
- Prevent authenticated users from accessing `/login`
- Session persistence across page refresh
- Logout functionality
- Access token handling
- Refresh token persistence
- Token refresh and failed-request retry handling

### Kanban Sprint Board

- Four sprint columns:
  - Backlog
  - In Progress
  - Review
  - Done
- Fetch tasks through a dedicated service layer
- Drag and drop using `@dnd-kit/core`
- Move tasks between columns
- Reorder tasks within columns
- Create tasks
- Edit task details
- Delete tasks with confirmation
- Dynamic task counts
- Task priority display
- Assignee display
- Due date display
- Task details side drawer
- Comments
- Persistent board state using Zustand + localStorage

### Analytics

The analytics dashboard provides:

- Sprint velocity
- Task status distribution
- Priority breakdown
- Completion trend

Charts are derived from application task data rather than hardcoded chart values.

### Notifications

- Polls JSONPlaceholder for new notifications
- Unread notification count
- Read/unread notification state
- Mark notification as read
- Mark all notifications as read
- Notification persistence using Zustand
- Polling pauses when browser tab is hidden
- Polling resumes when browser tab becomes visible
- Toast notification for new notifications

### Design System

Reusable UI components built using Tailwind CSS:

- Button
- Input
- Select
- Modal
- Toast
- DataTable
- Skeleton / Loading states

Components are designed to be reusable, responsive, and accessible.

### Accessibility

- Semantic HTML
- Accessible form labels
- Keyboard-friendly interactions
- Focus management
- Meaningful ARIA labels
- Responsive layouts
- Accessible loading and error states

### Performance

- Route-level code splitting using `React.lazy`
- `Suspense` loading states
- Memoization where appropriate
- TanStack Query caching
- Avoid unnecessary global state
- Responsive rendering

### Testing

Unit and component tests cover:

- Toast functionality
- Zustand board store
- Adding tasks
- Moving tasks
- Deleting tasks
- Authentication interceptor
- Token refresh and retry behavior

---

# Tech Stack

| Technology | Purpose |
|---|---|
| React 18+ | UI |
| TypeScript | Type safety |
| Vite | Build tooling |
| React Router | Routing |
| TanStack Query v5 | Server state |
| Zustand | Application/client state |
| Tailwind CSS | Styling |
| @dnd-kit/core | Drag and drop |
| Recharts | Data visualization |
| Vitest | Testing |
| React Testing Library | Component testing |
| Lucide React | Icons |

### APIs

- DummyJSON — authentication and token refresh
- JSONPlaceholder — simulated notification polling
- Mock JSON data — application task, sprint, user, comment, and initial notification data

---

# Architecture

SprintDesk separates server state, application state, local component state, and API/data access.

```text
                    React UI
                       │
                       ▼
              Components / Pages
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
      TanStack Query          Zustand
      Server State          Client State
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                 Service Layer
                       │
                       ▼
                 Data Source
              ┌────────┼────────┐
              │        │        │
              ▼        ▼        ▼
          Mock JSON DummyJSON JSONPlaceholder
