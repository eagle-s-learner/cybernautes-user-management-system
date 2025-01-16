
# User Management System

The User Management System is a full-stack web application designed to manage user data through a robust CRUD (Create, Read, Update, Delete) API and provide an interactive user visualization on the frontend.



## Backend

- Developed using **Node.js v22+** with the **Express framework and TypeScript** for type safety and scalability.
- Implements **RESTful APIs** with asynchronous operations for efficient data handling.
- Utilizes a **PostgreSQL database** (or preferred DB) for structured data storage.
- Follows best practices in API development, including proper error handling and optimized database queries.



## Frontend
- Built with **React v18+** and **TypeScript** for a modern and maintainable UI.
- Integrates **reactflow** for interactive visualization of users and their relationships.
## Project Setup

Open your system terminal

```bash
  git clone https://github.com/eagle-s-learner/cybernautes-user-management-system.git
```
Press **Enter**
```bash
  cd cybernautes-user-management-system
```
Press **Enter**
```bash
  cd client
  npm install
```
Press **Enter**
```bash
  cd server
  npm install
```
Press **Enter**

## Setup Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the server's root director

`PORT`

`DATABASE_USER`

`DATABASE_HOST`=localhost

`DATABASE_NAME`

`DATABASE_PASSWORD`

`DATABASE_PORT`=5432

Add the following details in your .env file.

- Create database into your postgres database.

```bash
create table users (
	id SERIAL primary key,
	name text not null,
	age integer
);

create table hobbies (
	id integer references users(id) on delete cascade,
	hobbies varchar(255) not null
);
```


## To Run the Project Locally

- Open the termial in client and server folder respictively.
- For client 
```bash
npm run dev
```

- For server
```bash
npm run start:dev
```

## API Reference

#### Get all users

```http
  GET /api/users
```

#### To create new user

```http
  POST /api/users
```

#### To edit user

```http
  PUT /api/users/`${id}`
```

#### To delete user

```http
  DELETE /api/users/`${id}`
```

