CREATE TABLE IF NOT EXISTS account (
	account_id serial PRIMARY KEY,
	username VARCHAR (255) NOT NULL,
	account_sid VARCHAR (255),
	auth_token VARCHAR (255),
	twiml_app_sid VARCHAR (255),
	created_on TIMESTAMP NOT NULL,
	updated_on TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS message (
	message_id serial PRIMARY KEY,
	from_number VARCHAR ( 50 ) NOT NULL,
	from_sid VARCHAR ( 50 ),
	to_number VARCHAR ( 50 ) NOT NULL,
	to_sid VARCHAR ( 50 ),
	body TEXT,
	created_on TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS call (
	call_id serial PRIMARY KEY,
	from_number VARCHAR ( 50 ) NOT NULL,
	from_sid VARCHAR ( 50 ),
	to_number VARCHAR ( 50 ) NOT NULL,
	to_sid VARCHAR ( 50 ),
	created_on TIMESTAMP NOT NULL
);


CREATE TABLE IF NOT EXISTS phone (
	phone_id serial PRIMARY KEY,
	fk_account_id INTEGER,
	sid VARCHAR ( 50 ) NOT NULL,
	"phoneNumber" VARCHAR ( 50 ) NOT NULL UNIQUE,
	"dateAddedToApp" TIMESTAMP NOT NULL
);