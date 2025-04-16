# masonic-app

## Tech Stack
* Frontend: React.js (with TailwindCSS for styling and Zustand or Redux for state management)
* Backend: Node.js with Express.js
* Database: MySQL
* Authentication: JSON Web Tokens (JWT) with bcrypt for password hashing
* File Storage: Either local storage, AWS S3, or Firebase Storage
* Real-time Chat: WebSockets (Socket.io)
* API Security: Middleware-based role-based access control (RBAC)

## Main Features & Implementation Plan
### Authentication System
* JWT-based login/signup
* Users belong to one or more access groups (Masonic degrees)
* Admin panel to manage user roles and permissions
### File Upload & Management
* File metadata (title, author, description, category, tags, access level)
* Visibility based on user’s access level
* File storage in local directory or cloud service (e.g., AWS S3)
* API endpoints for file upload and retrieval
### Download Section
* Users can see only the files they have access to
* Sorting & filtering by title, author, category, tags
* Guest users can see/download public files
### User Profiles
* Profile photo upload
* Editable details: email, phone, profession, degree, lodge position
* Only logged-in users can access profiles
### Real-time Chat
* WebSockets (Socket.io) for real-time messaging
* List of online users
* Private messaging between logged-in users
