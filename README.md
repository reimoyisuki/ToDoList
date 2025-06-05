# Group Todo Management

##

Azra Nabila Azzahra - 2306161782
Arsinta Kirana Nisa - 2306215980
Kharisma Aprilia - 2306223244

## Overview

This Todo provides a comprehensive solution for managing group tasks, messages, and user collaboration. It allows users to:

- Create and manage groups
- Assign tasks within groups
- Communicate via group messages
- Track user activity and participation

## Features

### Group Management
- Create groups with multiple members
- Add/remove members (admin-only)
- View group details and member lists
- Get all groups a user belongs to

### Todo Lists
- Create personal and group todos
- Set priority levels (severity)
- Update and delete todos
- View todos sorted by priority

### Messaging
- Send messages to groups
- View message history
- Track most active users in each group

### User Management
- User registration and authentication
- Profile management
- Activity tracking
- Online status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/all` - Get all users (admin)
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/changename/:id` - Change username
- `DELETE /api/users/delete/:id` - Delete account

### Groups
- `POST /api/groups/create` - Create new group
- `PUT /api/groups/add-member` - Add member to group
- `PUT /api/groups/remove-member` - Remove member from group
- `GET /api/groups/user/:userId` - Get user's groups
- `GET /api/groups/details/:groupId` - Get group details
- `GET /api/groups/todos/:groupId` - Get group todos

### Messages
- `POST /api/messages/send` - Send group message
- `GET /api/messages/:groupId` - Get group messages
- `GET /api/messages/:groupId/most-active` - Get most active users

### Todos
- `POST /api/todos/create` - Create new todo
- `GET /api/todos/:userId` - Get user todos
- `PUT /api/todos/update/:id` - Update todo
- `DELETE /api/todos/delete/:id` - Delete todo

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (create `.env` file):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```
4. Start the server: `npm start`

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing

## Error Handling

All API responses follow this format:
```json
{
  "success": boolean,
  "message": "description",
  "data": {} // optional
}
```

Error responses include:
- 400 Bad Request - Invalid input
- 401 Unauthorized - Authentication failed
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Server Error - Internal server error

## Security

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- Input validation
- Secure HTTP headers
