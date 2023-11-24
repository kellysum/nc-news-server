# Northcoders News API
This project serves as the backend server providing access to news articles, comments, topics, and user-related functionalities through API endpoints.

To interact with the NC News Server, visit the hosted version, https://nc-news-server-o3yf.onrender.com.

You can fork and clone the NC News Server repository to your local machine. 

In order to set up, ensure all necessary dependencies are installed by running: npm install, all the dependencies in package.json file should be installed. 

For local development, you'll need to set up your local database and seed it with initial data. You can run 'npm run setup-dbs' to set up local databases and 'npm run seed' to seed the local database.

When doing testing, use the 'npm test' command and make sure to install jest. You can use the test data to run the test. 

We should create two .env file before we use this server, .env.development and .env.test have to be added first, which helps us to successfully connect to the two databases locally. 

In each .env file, add PGDATABASE=, with the correct database name for that environment. The database name are nc_news for .env.devlopment and nc_news_test for .env.test . 

And check that these .env files are .gitignored.

The minimum version of Node.js should be v20.8.0 and Postgres should be 14.9.