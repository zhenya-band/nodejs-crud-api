# Simple crud-api

## How to start
1. clone the repo

        git clone https://github.com/zhenya-band/nodejs-crud-api.git

2. move to the created folder

        cd nodejs-crud-api

3. checkout to the development branch

        git checkout develop-v2

4. use 18 version of nodejs and install all dependencies

        npm i

5. specify PORT in this file .env (default is 3000)

## How to run application


Run the app in development mode

    npm run start:dev


Run the app in production mode

    npm run start:prod


Run tests

    npm test
___

## Server API

Implemented endpoint:
`api/users`

Methods:

**GET** `api/users` is used to get all users
**GET** `api/users/${userId}` is used to get user by id
Server answers with status code **200** and record with `id === userId` if it exists  
Server answers with status code **400** and corresponding message if `userId` is invalid (not uuid)  
Server answers with status code **404** and corresponding message if record with `id === userId` doesn't exist  

**POST** `api/users `is used to create record about new user and store it in database  
Server answers with status code **201** and newly created record  
Server answers with status code **400** and corresponding message if request body does not contain required fields  
   
**PUT** `api/users/{userId}` is used to update existing user  
Server answers with status code **200** and updated record  
Server answers with status code **400** and corresponding message if `userId` is invalid (not uuid)  
Server answers with status code **404** and corresponding message if record with `id === userId` doesn't exist  
   
**DELETE** `api/users/${userId}` is used to delete existing user from database  
Server answers with status code **204** if the record is found and deleted  
Server answers with status code **400** and corresponding message if `userId` is invalid (not uuid)  
Server answers with status code **404** and corresponding message if record with `id === userId` doesn't exist  

Users are stored as `objects` that have following properties:
    - `id` — unique identifier (`string`, `uuid`) generated on server side
    - `username` — user's name (`string`, **required**)
    - `age` — user's age (`number`, **required**)
    - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)