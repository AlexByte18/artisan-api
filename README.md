# Artisan API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

A robust REST API built with **NestJS** and **TypeORM** for managing products, authentication, and real-time messaging with WebSockets.

## 📋 Description

Artisan API is a production-ready backend service that provides:

- 🔐 **JWT Authentication** with secure password hashing
- 📦 **Product Management** with full CRUD operations
- 🔑 **Role-based Access Control** (RBAC)
- 📤 **File Upload Management** with static file serving
- 💬 **Real-time Messaging** with WebSocket support
- 🌍 **PostgreSQL Database** integration
- ✅ **Data Validation** with class-validator
- 📝 **Comprehensive Testing** (unit & e2e tests)

## 🚀 Key Features

### Authentication & Authorization
- User registration and login
- JWT token generation and validation
- Password encryption with bcrypt
- Role-based access control

### Product Management
- List, create, update, and delete products
- Product search and filtering
- Product images/files management
- Seed data for development

### Real-time Features
- WebSocket support for live messaging
- Socket.IO integration
- Real-time notifications

### File Management
- File upload handling
- Static file serving
- Product image storage

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | NestJS 9 |
| **Language** | TypeScript 4.7 |
| **Database** | PostgreSQL 14+ |
| **ORM** | TypeORM |
| **Authentication** | JWT + Passport |
| **WebSockets** | Socket.IO |
| **Validation** | Class-validator |
| **Testing** | Jest |
| **Package Manager** | npm |

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL 14+
- Docker (optional, for PostgreSQL via docker-compose)

### Steps

```bash
# Clone the repository
git clone <repository-url>
cd artisan-api

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Update .env with your database credentials
# Example:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=artisan_db
# JWT_SECRET=your_jwt_secret
```

## 🏃 Running the Application

### Development
```bash
npm run start:dev
```
The API will run on `http://localhost:3000`

### Production
```bash
npm run build
npm run start:prod
```

### With Docker
```bash
# Start PostgreSQL container
docker-compose up -d

# Run migrations and start app
npm run start:dev
```

## 📝 Available Scripts

```bash
# Development
npm run start:dev        # Start with watch mode
npm run start:debug      # Start with debugger
npm run start            # Start production-like mode

# Building
npm run build            # Build for production
npm run prebuild         # Clean dist folder

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Generate coverage report
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint with auto-fix
npm run format           # Format code with Prettier
```

## 📁 Project Structure

```
src/
├── auth/               # Authentication & Authorization
│   ├── strategies/     # JWT & Passport strategies
│   ├── guards/         # Auth guards
│   └── decorators/     # Custom decorators
├── products/           # Product management
│   ├── entities/       # Product models
│   ├── dto/            # Data transfer objects
│   └── services/       # Business logic
├── files/              # File management
│   ├── controllers/    # File upload endpoints
│   └── services/       # File handling logic
├── messages-ws/        # WebSocket messaging
│   ├── gateways/       # Socket.IO gateways
│   └── services/       # Message logic
├── common/             # Shared utilities
│   ├── decorators/     # Custom decorators
│   ├── guards/         # Common guards
│   ├── pipes/          # Validation pipes
│   └── filters/        # Exception filters
├── seed/               # Database seeding
└── main.ts             # Application entry point
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) with Passport.js:

1. **Register**: Create a new user account
2. **Login**: Get a JWT token
3. **Access Protected Routes**: Use token in Authorization header

```bash
# Example request
curl -H "Authorization: Bearer <your_jwt_token>" \
  http://localhost:3000/api/products
```

## 🗄️ Database

### Setup PostgreSQL

#### Using Docker Compose:
```bash
docker-compose up -d
```

#### Manual Setup:
```bash
# Create database
createdb artisan_db

# Run migrations
npm run typeorm migration:run
```

### Seed Database
```bash
npm run seed
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=artisan_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=3600

# File Upload
FILE_UPLOAD_PATH=./static/uploads

# Server
PORT=3000
NODE_ENV=development
```

## 📚 Code Quality

### ESLint
```bash
npm run lint
```

### Prettier
```bash
npm run format
```

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### JWT Validation Issues
- Verify JWT_SECRET in .env
- Check token format in Authorization header
- Ensure token hasn't expired

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📄 License

MIT

## 👤 Author

**Artisan Development Team**

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Last Updated:** November 2025
