# Backend

## Setup

1. git clone this repo into your local machine,
2. `cd` into `/Backend` and run `npm i` to install dependencies in package.json file
3. in pgadmin4, create a local database named "exabloom"
4. create an `.env` file to contain all environment variables eg. :

```env
PG_USER=postgres/ your user name
PG_HOST=localhost/your host name
PG_DATABASE=exabloom
PG_PASSWORD=your password
PG_PORT=5432/ your port
```

5. run `node index.js` to start up the backend. ensure you are using a LTS version of node, the one I used is v22.14.0
6. use postman/ other api tools to make requests to the backend:

`localhost:3000/populate` will populate the database with contacts and messages
`localhost:3000/recent-conversations?page={pagination number}&searchValue={search input}` will allow you to search for values from the `phone number` or `last_message` input field
