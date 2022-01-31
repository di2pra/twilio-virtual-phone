# Twilio Virtual Phone

![Twilio Virtual Phone Screenshot](/screenshot.png)

## How to use ?

Rerequisite :
1. SQL Database (ex. PostgreSQL)
2. Cloud Hosting Service (ex. Heroku)

Install Guide :
1. Create your PostgreSQL database and execute the SQL script file `script.sql` available in the main folder
2. Set the below required environment variables in your hosting service :
    - DATABASE_URL : PostgreSQL Connection String (example : postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...])
    - API_KEY : Random key to access the application
    - PORT : HTTP Server Port
    - TWILIO_ACCOUNT_SID : Your Twilio Account SID
    - TWILIO_AUTH_TOKEN : Your Twilio Account Token
3. Deploy the Node.Js application in your hosting service and run the command below to install the dependencies.
    ```
    npm install
    ```
4. Run the command below to start the application
    ```
    npm start
    ```