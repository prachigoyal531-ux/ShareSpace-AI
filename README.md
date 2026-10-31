# ShareSpace AI – Smart Resource Sharing Platform

**A smarter, fairer way to share institutional resources.**

ShareSpace AI is a resource-sharing platform designed to help colleges and educational institutions manage shared resources such as laptops, cameras, projectors, laboratories, seminar rooms, and other equipment.

The platform aims to improve resource accessibility, reduce underutilisation, and make the allocation process more transparent through booking workflows, FairShare prioritisation, and accountability features.

> **Demo Notice:** This project uses fictional sample data for demonstration purposes. It is not an officially deployed system of Poornima College of Engineering.

## Problem Statement

Educational institutions often have limited shared resources, while multiple students and departments need access to them.

Traditional manual booking systems can lead to:
- Unequal access to frequently requested resources.
- Booking conflicts and scheduling confusion.
- Poor visibility into resource availability.
- Lack of accountability during handover and return.
- Difficulty tracking resource conditions and maintenance.

ShareSpace AI aims to address these challenges through a centralised digital platform.

## Key Features

### 1. Resource Discovery
- Browse available institutional resources.
- View resource details and availability.
- Explore resources by category and requirements.

### 2. Smart Booking Management
- Submit resource booking requests.
- View personal bookings and their status.
- Support booking approval and rejection workflows.
- Manage competing requests and waiting lists.

### 3. FairShare Allocation Engine
- Prioritises eligible student requests using previous completed bookings of the same resource.
- Gives priority to students with fewer completed bookings of that resource.
- Uses request timestamps and registration IDs as tie-breakers.
- Separates competing requests by resource and overlapping time slots.

### 4. Role-Based Dashboards

The platform supports three roles:

- **Student:** Explore resources, request bookings, view booking status, and participate in check-in/check-out workflows.
- **Lab Owner:** Manage assigned resources, review booking requests, and verify resource handovers and returns.
- **Admin:** Oversee users, resources, bookings, incidents, and administrative activities.

### 5. Check-in and Check-out
- Track resource handover and return.
- Support owner verification.
- Maintain accountability throughout the borrowing lifecycle.

### 6. Condition and Incident Reporting
- Record resource condition information.
- Report damage or incidents.
- Support maintenance and resource availability management.

### 7. AI-Assisted Resource Matching
- Helps users discover relevant resources based on their requirements.

### 8. Activity and Audit History
- Maintain visibility into important booking and resource-related activities according to user roles.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| TypeScript | Application logic and type safety |
| Vite | Development and build tooling |
| CSS | Styling and responsive interface |
| Local Storage | Current demo data persistence |
| Google AI Studio | AI-assisted development |
| GitHub | Source code hosting and version control |
| Supabase | Planned backend integration |

**Implementation note:** Supabase is included in the planned architecture but is not currently connected as the application's live database. The current demo uses local storage.

## Demo Environment

The project contains fictional sample users and institutional resources.

The demo supports three roles:
- Student
- Lab Owner
- Admin

Use the application's **Quick Login** option to explore the predefined demo accounts, where available.

All names, IDs, and records in the demonstration are fictional.

## Getting Started

### Prerequisites
- Node.js
- npm
- A web browser
- Git

### Run Locally

1. Clone the repository:

   `git clone https://github.com/prachigoyal531-ux/ShareSpace-AI.git`

2. Open the project directory:

   `cd ShareSpace-AI`

3. Install dependencies:

   `npm install`

4. Start the development server:

   `npm run dev`

5. Open the local URL displayed in your terminal.

## Security, Fairness and Limitations

- Role-based access is intended to separate student, owner, and admin workflows.
- FairShare prioritisation considers eligible requests and resource-specific booking history.
- The current application is a demonstration and should not be used with real institutional or personal records.
- Local storage is not a substitute for secure production authentication and database access controls.
- Supabase authentication, database integration, and production-level security policies remain future work.
- AI-assisted matching should be treated as a discovery aid, not a guarantee of eligibility or allocation.

## Future Scope

- Complete Supabase backend integration.
- Secure institutional email verification.
- Stronger role-based access control and audit logging.
- Improved AI-powered resource recommendations.
- Notifications for booking approvals, reminders, and returns.
- Analytics for resource utilisation and demand forecasting.
- Mobile-friendly institutional deployment.

## Development and AI Disclosure

This project was developed with assistance from Google AI Studio and AI-based coding tools.

The development process included prompt-based code generation, feature refinement, workflow review, manual testing, and iterative debugging.

GitHub is used to maintain and share the project's source code.

## Project Repository

[ShareSpace AI – GitHub Repository](https://github.com/prachigoyal531-ux/ShareSpace-AI)

---

**ShareSpace AI – Making resource sharing smarter, fairer, and more accountable.**
