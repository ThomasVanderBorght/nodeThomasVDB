# nodeThomasVDB

This project is a RESTful API built with Express.js and MySQL. It includes user registration, login, and authentication using JSON Web Tokens (JWT). Features include:

- User validation with Joi.
- Password hashing using bcrypt.
- Secure token-based authentication.
- CRUD operations for users and posts.
- Pagination, sorting, and search functionality.

  ## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or later)
- [MySQL](https://www.mysql.com/) (v9.0.1 or later)

## Installation

1. Clone the repository:
   ```bash
    git clone https://github.com/your-username/your-repo.git

   
  cd your-repo
   
then install your dependencies using
  npm install

Add your database

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET= 6270c809d9a61ee54a498b0f6470cd790eaa50ca2f117f46ffb31a20991925ae0679b01f77b1112a4df9c139c8469960a4159c466cc96cc08e3499ddb445ec04

Make sure to create a database and add the schenae.sql file to it using 
mysql -u root -p your_database_name < schema.sql

to start the project use 
npm start

install postman to use the api's

The following data is dummydata anc can be replaced with your data

Users:

Post:
http://localhost:3000/users/create 
Json Raw 
{
  "firstName": "user",
  "lastName": "user",
  "email": "user.user@user.com",
  "age": 25,
  "phone": "+32 123 45 67 89",
  "password": "Password!1"
}

http://localhost:3000/users/login
Json Raw
{
  "email": "user.user@user.com",
  "password": "Password!1"
}

now you will receive a jwt token to use for the rest of the routes
make sure you put the token in your header using the following method

key: Authorization value: Bearer your-token

replace your-token with the actual token

Get:
all users
http://localhost:3000/users
no body but you need the token

http://localhost:3000/users/id 
replace the id with the id of the user you want to search
no body but you need the token

put:
http://localhost:3000/users/update/id
replace the id with the id of the post you want to search
Json Raw
{
  "firstName": "user",
  "lastName": "username",
  "email": "user.user@user.com",
  "age": 25,
  "phone": "+32 123 45 67 89",
  "password": "Password!1"
}

delete:
delete user
http://localhost:3000/users/delete/id
replace id with the id of the user you want to delete
dont forget token
no body 


Posts

Get:
all posts
http://localhost:3000/posts
no body but you need the token

specific post
http://localhost:3000/posts/id
replace the id with the id of the post you want to search
no body but you need the token

post sorted by title
http://localhost:3000/posts/search/title?title=titlename
replace titlename with the actual name
dont forget the token
no body

post sorted by category
http://localhost:3000/posts/search/category?category=categoryname
replace categoryname with the actual name
dont forget the token
no body

post sorted by title aswell as category
http://localhost:3000/posts/search/category/title?category=categoryname&title=titlename
replace titlename with the actual name
replace categoryname with the actual name
dont forget the token
no body


Post:
http://localhost:3000/posts/create
Json Raw
{
  "title": "userpost",
  "content": "this is a post",
  "category": "test",
  "author_id": 4
}

Put:
http://localhost:3000/posts/update/id
replace the id with the id of the post you want to search
Json Raw 
{
  "title": "userpost",
  "content": "this is a post",
  "category": "test1",
  "author_id": 4
}

Delete:
delete post
http://localhost:3000/posts/delete/id
replace id with the id of the post you want to delete
no body











