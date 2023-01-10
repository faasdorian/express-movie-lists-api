# movies-list

## Description

This is a simple API to manage movies lists. It was developed using Node.js, Express and TypeORM.
The idea is to keep this project as simple as possible, so it can be used as a reference for future projects, always adding new features and improving the code.

## Packages used

- [Express](https://expressjs.com/)
- [TypeORM](https://typeorm.io/#/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)


## How to run the project locally

1. Clone the repository
2. Run `npm install` to install all the dependencies
3. Setup the environment variables in the `.env` file (use `.env.example` as a reference)
3. Run `npm start` to start the project
4. Use [http://localhost:3000](http://localhost:3000) to access the project

## Routes

### Auth

- `POST /auth/signup` - Register a new user
  ```
  {
    "username": "userexample",
    "password": "$trongP@ssw0rd3x4mpl3"
  }
  ```
- `POST /auth/login` - Login an user
  ```
  {
    "username": "userexample",
    "password": "$trongP@ssw0rd3x4mpl3"
  }
  ```
  An access token will be returned in the response body, which will be used to access the other routes.

### List

- `POST /list` - Create a new list
  ```
  {
    "title": "my list",
    "privacy": "public" | "private"
  }
  ```
- `GET /list` - Get lists
    - Query parameters:
      - userId: get a specific user public lists
      - page
      - limit
    - All lists (private and public) from the logged user will be returned if no userId is specified

- `POST /list/:listId/items` - Add items to a list
   ```
   {
     "moviesIds": ["id1", "id2", "id3"]
   }
   ```