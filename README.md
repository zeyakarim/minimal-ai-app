# Minimal AI Customer Support Agent

![AI Chat Agent Banner](https://via.placeholder.com/1200x400/5267E8/FFFFFF?text=AI+Customer+Support+Agent)
_A scalable and intelligent customer support solution powered by AI._

## Table of Contents

- [Minimal AI Customer Support Agent](#minimal-ai-customer-support-agent)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Architecture](#architecture)
    - [Backend (Node.js/Express/TypeScript)](#backend-nodejs expresstypescript)
    - [Frontend (React/TypeScript/Vite/Tailwind CSS)](#frontend-reacttypescriptvitetailwind-css)
    - [Database (PostgreSQL)](#database-postgresql)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Local Development (with Docker Compose)](#local-development-with-docker-compose)
    - [Running Without Docker (Development)](#running-without-docker-development)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Chat](#chat)
  - [Deployment](#deployment)
  - [Future Enhancements](#future-enhancements)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

---

## Project Overview

The "Minimal AI Customer Support Agent" is a robust, full-stack web application designed to provide intelligent, real-time customer support. Leveraging the power of modern web technologies and AI, it offers a seamless chat experience for users and efficient management for administrators.

This project is built with a focus on scalability, maintainability, and developer experience, employing best practices in both frontend and backend development.

## Features

-   **User Authentication:** Secure signup and login for users.
-   **AI-Powered Chat:** Real-time conversational AI integration for customer queries.
-   **Chat History:** Persistent storage and retrieval of chat conversations.
-   **Responsive UI:** A clean, intuitive, and responsive user interface built with React and Tailwind CSS.
-   **Containerized Development:** Full Docker Compose setup for easy local development and consistent environments.
-   **Type-Safe Development:** End-to-end type safety using TypeScript.

## Architecture

The application follows a standard client-server architecture, with a clear separation of concerns between the frontend, backend, and database layers.

```mermaid
graph TD
    A[User/Browser] -- "HTTP/S" --> B["Frontend - React/Vite"]
    B -- "API Calls (Axios)" --> C["Backend - Node.js/Express/TypeScript"]
    C -- "ORM (Sequelize)" --> D["Database - PostgreSQL"]
    C -- "LLM API Calls" --> E["OpenRouter AI Service"]
<img width="1514" height="1434" alt="project-architecture" src="https://github.com/user-attachments/assets/23a3e35f-fbc0-4a95-8a25-24ddb9e1ea41" />
<img width="2816" height="1824" alt="backend-architechture" src="https://github.com/user-attachments/assets/40354105-5356-4d13-9e23-8e1cc6897749" />

<img width="847" height="2146" alt="database-architechture" src="https://github.com/user-attachments/assets/a5456d62-fe5b-4c3c-9ef6-ed733099fda2" />

<img width="3237" height="1713" alt="api-flow-sequence" src="https://github.com/user-attachments/assets/370ed8e3-c08d-49e5-bd71-10f8f1c73690" />


Backend (Node.js/Express/TypeScript)
The backend is a RESTful API built with Node.js, Express, and TypeScript. It handles user authentication, manages chat sessions, communicates with the AI service (OpenRouter), and interacts with the PostgreSQL database.

Framework: Express.js

Language: TypeScript

ORM: Sequelize (for PostgreSQL interaction)

Authentication: JWT (JSON Web Tokens)

AI Integration: OpenRouter API

Dependency Management: npm

Frontend (React/TypeScript/Vite/Tailwind CSS)
The frontend is a modern single-page application (SPA) developed with React.js, powered by Vite for a fast development experience. Tailwind CSS is used for utility-first styling, ensuring a consistent and responsive design.

Framework: React.js

Build Tool: Vite

Styling: Tailwind CSS

State Management/Data Fetching: React Query

Language: TypeScript

HTTP Client: Axios

Notifications: React Hot Toast

Database (PostgreSQL)
PostgreSQL is used as the relational database to store user information and chat message history. Sequelize, an ORM, facilitates seamless interaction between the Node.js backend and the database.

Type: Relational Database

Managed Service: AWS RDS (as configured in .env)

Local Option: PostgreSQL Docker container (if external DB is not used)

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS recommended)

npm (comes with Node.js)

Docker Desktop (includes Docker Engine and Docker Compose)

Git

Environment Variables
Both the backend and frontend require specific environment variables to function correctly.

backend/.env
Create a file named .env in the backend/ directory with the following content.
Important: Ensure origins is a valid JSON string, wrapped in single quotes.

Code snippet

PORT=3002
DATABASE_URL="postgresql://postgres:{password}@{hostaddress}:5432/{database}" # Your external RDS URL
JWT_SECRET='your_strong_jwt_secret_key' # Replace with a strong, random string
origins='["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]' # Allowed CORS origins for your frontend
OPENROUTER_API_KEY='sk-or-v1-YOUR_OPENROUTER_API_KEY' # Get from OpenRouter.ai
frontend/src/vite-env.d.ts
This file is for TypeScript to understand the structure of import.meta.env. It should be automatically generated by Vite, but ensure it includes:

TypeScript

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
Local Development (with Docker Compose)
This is the recommended way to run the project locally, as it ensures consistency and simplifies setup.

1. Clone the repository
Bash

git clone <repository_url>
cd minimal-ai-app
2. Create .env files
Place the backend/.env file as described above.

3. Configure docker-compose.yml
Ensure your docker-compose.yml (located in the project root) looks like this, using your external DATABASE_URL and connecting to the backend service internally:

YAML

version: '3.8'

services:
  # The 'db' service is commented out because your DATABASE_URL points to an external database (your RDS instance).
  # If you wanted a local PostgreSQL instance, you would uncomment this and adjust DATABASE_URL in backend/.env
  # db:
  #   image: postgres:15-alpine
  #   restart: always
  #   environment:
  #     POSTGRES_USER: user
  #     POSTGRES_PASSWORD: password
  #     POSTGRES_DB: db_name
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

  backend:
    build: ./backend
    restart: always
    environment:
      - PORT
      - DATABASE_URL
      - JWT_SECRET
      - OPENROUTER_API_KEY
      - origins
    env_file:
      - ./backend/.env
    ports:
      - "3002:3002" # Maps container port 3002 to host port 3002
    depends_on:
      # If using the internal 'db' service, add '- db' here
      - frontend

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "3000:3000" # Maps container port 3000 to host port 3000
    environment:
      VITE_API_BASE_URL: http://backend:3002 # Frontend connects to backend service within Docker network
    depends_on:
      - backend

volumes:
  postgres_data:
4. Build and Run Services
From the project root directory, run:

Bash

docker-compose up --build
This command will:

Build the Docker images for your backend and frontend.

Start the services.

Link them according to the depends_on configuration.

Your database will be initialized and models synchronized automatically by the backend on startup.

5. Access the Application
Frontend: Open your web browser and navigate to http://localhost:3000.

Backend API: The backend will be accessible on http://localhost:3002.

Running Without Docker (Development)
If you prefer to run the services directly on your host machine for development:

Backend
Navigate into the backend directory:

Bash

cd backend
Install dependencies:

Bash

npm install
Ensure your backend/.env file is configured as above.

Start the backend server:

Bash

npm run dev # Or 'npm start' if using a non-dev script
The backend should start on http://localhost:3002.

Frontend
Open a new terminal and navigate into the frontend directory:

Bash

cd frontend
Install dependencies:

Bash

npm install
Create an .env file for the frontend (or ensure vite-env.d.ts is configured for import.meta.env).
For local development without Docker, your VITE_API_BASE_URL in your frontend's configuration (e.g., in a local .env.local or directly in api/index.ts for testing) should point to your host's backend:

Code snippet

# frontend/.env.local (or similar)
VITE_API_BASE_URL=http://localhost:3002
Start the frontend development server:

Bash

npm run dev
The frontend should start on http://localhost:3000 (or http://localhost:5173).

API Endpoints
The backend exposes the following RESTful API endpoints:

Authentication
POST /auth/signup: Register a new user.

Request: { username, email, password }

Response: { success: true, message: "User registered successfully" }

POST /auth/login: Authenticate a user and receive a JWT.

Request: { username, password }

Response: { success: true, token: "jwt_token" }

GET /auth/me: Get current authenticated user details (requires JWT).

Response: { success: true, data: { id, username, email, role } }

Chat
POST /chat/send: Send a new message to the AI. (Requires JWT)

Request: { message: "Your message here" }

Response: { success: true, data: { id, role: "assistant", content: "AI response" } }

GET /chat/history: Retrieve the user's chat history. (Requires JWT)

Response: { success: true, data: [{ id, role, content, createdAt }] }

Deployment
For production deployment, consider platforms like:

Frontend: Vercel, Netlify

Backend: Render, Railway, AWS ECS/EC2, Google Cloud Run

Database: AWS RDS (as currently configured), Google Cloud SQL, Azure Database for PostgreSQL
