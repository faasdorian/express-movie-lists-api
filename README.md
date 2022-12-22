# movies-list

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