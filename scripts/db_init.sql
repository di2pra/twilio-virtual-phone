CREATE TABLE IF NOT EXISTS account (
	account_id serial PRIMARY KEY,
	username VARCHAR (255) NOT NULL,
	account_sid VARCHAR (255),
	api_key VARCHAR (255),
	api_secret VARCHAR (255),
	twimlAppId VARCHAR (255),
	created_on TIMESTAMP NOT NULL,
	updated_on TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS configuration (
	configuration_id serial PRIMARY KEY,
	version integer NOT NULL,
	body TEXT,
	created_on TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS message (
	message_id serial PRIMARY KEY,
	from_number VARCHAR ( 50 ) NOT NULL,
	to_number VARCHAR ( 50 ) NOT NULL,
	body TEXT,
	created_on TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS call (
	call_id serial PRIMARY KEY,
	from_number VARCHAR ( 50 ) NOT NULL,
	to_number VARCHAR ( 50 ) NOT NULL,
	created_on TIMESTAMP NOT NULL
);


CREATE TABLE IF NOT EXISTS phone (
	phone_id serial PRIMARY KEY,
	alias VARCHAR ( 255 ) NOT NULL,
	number VARCHAR ( 50 ) NOT NULL UNIQUE,
	created_on TIMESTAMP NOT NULL
);

CREATE OR REPLACE VIEW message_phone AS
    SELECT
	msg.message_id,
	msg.from_number,
	from_phone.phone_id as from_phone_id,
	msg.to_number,
	to_phone.phone_id as to_phone_id,
	msg.body,
	msg.created_on
    FROM "message" as msg
	LEFT JOIN phone as from_phone ON (msg.from_number = from_phone.number)
	LEFT JOIN phone as to_phone ON (msg.to_number = to_phone.number);


CREATE OR REPLACE VIEW call_phone AS
    SELECT
	call.call_id,
	call.from_number,
	from_phone.phone_id as from_phone_id,
	call.to_number,
	to_phone.phone_id as to_phone_id,
	call.created_on
    FROM "call" as call
	LEFT JOIN phone as from_phone ON (call.from_number = from_phone.number)
	LEFT JOIN phone as to_phone ON (call.to_number = to_phone.number);