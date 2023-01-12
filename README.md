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
  To register a new admin user, add the `isAdmin` property to the request body and set it to `true`:
  ```
  {
    "username": "admin",
    "password": "$trongP@ssw0rd3x4mpl3",
    "isAdmin": true
  }
  ```
  The admin user will be created with the `isAdmin` property set to `true` in the database.
  To create a new admin user, the logged user must be an admin user.
  You can create the first admin user by setting the field `isAdmin` to true manually in the database.
  
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

- `PUT /list/:listId` - Update a list
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
    - Only public lists from the specified user will be returned if a userId is specified

- `GET /list/:listId` - Get a specific list with its items

- `DELETE /list/:listId` - Delete a list


### Items

- `POST /items` - Add items to a list
   ```
   {
     "listId": "listId",
     "moviesIds": ["id1", "id2", "id3"]
   }
   ```

- `PUT /items/:itemId` - Update an item from a list
   ```
   {
     "watched": true
   }
   ``

- `DELETE /items/:itemId` - Remove an item from a list

### Movie

- `POST /movie`
  ```
  {
    "title": "movie title"
  }
  ```
  Only admin users can add new movies to the database.
  In the future, this route will be integrated with the [OMDb API](http://www.omdbapi.com/) to get the movie information.

- `GET /movie` - Get movies
    - Query parameters:
      - title: get a specific movie
      - page
      - limit
  
  The movie routes will be used to search for movies in the future and add more information about a movie.

## TODO

- [ ] Add tests
- [ ] Add swagger
- [ ] Add pagination to movies route
- [ ] Add search for movies
- [ ] Add more information about movies
- [ ] Add more information about lists
- [ ] Add more information about items
- [ ] Add more information about users

## Final considerations
This project was developed to learn more about Node.js and TypeORM. If it can help someone, it will be great.
<br>If you find any bugs or have any suggestions, feel free to open an issue or make a pull request.
<br>Hope you enjoy it and if you want to star it i'll be very happy :D