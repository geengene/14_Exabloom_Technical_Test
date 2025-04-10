# Backend

## Setup

1. git clone this repo into your local machine, the repo contains both the front and back end technical test. `git clone https://github.com/geengene/14_Exabloom_Technical_Test.git`
2. `cd` into `/Backend` and run `npm i` to install dependencies in package.json file
3. in pgadmin4, create a local database named "exabloom"
4. create an `.env` file at `/Backend/.env` path to contain all environment variables eg. :

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

## System requirements

1. have the latest node long term support (LTS) version installed
2. have latest versions of Postgres installed and pgadmin4 for viewing data
3. have Postman for accessing endpoints of backend

## Assumptions made

1. Assumed the 5 million messages are from the pool of messages from `messages_content.csv`
2. There was no requirement for contact name to be a field in in the schema of tables, thus I assume contact name is replaceable with contact number

## Brief explanation of key design decisions

1. `loadMessagesContent()` function creates an array of messages from each line of `message_content.csv` which is passed as `messagePool` to `insertMessages(messagePool)`
2. `insertMessages()` inserts messages into database by batches of 5000. each batch is an array of values which are used as query parameters when inserting into the database. so each insert query loads 5000 sets of (contact_id, content, created_at). faker.js libary is used generate fake data for `contact_id` and `created_at`
3. batch insertion loops until the fulfilled amount of 5 million is reached
4. `insertContacts()` similarly batch inserts datasets (phone_number, created_at, updated_at) into database, in batches of 5000 until 100k contacts is populated

5. the `/populate` route populates the database by running the 3 functions
6. `/recent_conversations` retrieves the 50 most recent conversations, as defined in the document for the backend technical test,
7. `/recent-conversations?page={pagination number}&searchValue={search input}` will allow you to search for values from the `phone number` or `last_message` input field, and each page will have a limit of 50 datasets

### Footnotes

- [!] there is no contact.name

`I said I went to heaven because I thought it would get me attention." The admission created a firestorm within the worlds of evangelical faith and Christian publishing`
...
`I'm curious to see it with my kids.  We're a dog-loving family.  They're "man`

Demonstrates the query performance
Discusses the optimization strategies employed
Addresses any challenges encountered and how they were overcome
