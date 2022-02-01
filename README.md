# Twilio Virtual Phone

![Twilio Virtual Phone Screenshot](/screenshot.png)


## How to use ?

Prerequisite :
1. SQL Database (PostgreSQL)
2. Cloud Hosting Service (ex. Heroku)

Install Guide :
1. Create your PostgreSQL database and execute the SQL script file `scripts/db_init.sql` available in the main folder
2. Set the below required environment variables in your hosting service :
    - DATABASE_URL : PostgreSQL Connection String (ex. : `postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]`)
    - API_KEY : Not null Random key to access the application
    - TWILIO_ACCOUNT_SID : Your Twilio Account SID
    - TWILIO_AUTH_TOKEN : Your Twilio Account Token
3. Deploy the Node.js application in your hosting service and run following command to build and install the application.
    ```shell
    npm install
    ```
4. Run the following command to start the application
    ```shell
    npm start
    ```

Install Guide :
1. Create your PostgreSQL database and execute the SQL script file `scripts/db_init.sql` available in the main folder
2. Set the below required environment variables in your hosting service :
    - DATABASE_URL : PostgreSQL Connection String (ex. : `postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]`)
    - API_KEY : Not null strong random key to access the application
    - TWILIO_ACCOUNT_SID : Your Twilio Account SID
    - TWILIO_AUTH_TOKEN : Your Twilio Account Token
3. Deploy the Node.js application in your hosting service and run following command to build and install the application.
    ```shell
    npm install
    ```
4. Run the following command to start the application
    ```shell
    npm start
    ```