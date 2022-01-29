CREATE TABLE message (
	message_id serial PRIMARY KEY,
	from_number VARCHAR ( 50 ) NOT NULL,
	to_number VARCHAR ( 50 ) NOT NULL,
	body TEXT,
	created_on TIMESTAMP NOT NULL
);


CREATE TABLE phone (
	phone_id serial PRIMARY KEY,
	alias VARCHAR ( 255 ) NOT NULL,
	number VARCHAR ( 50 ) NOT NULL,
	created_on TIMESTAMP NOT NULL
);

CREATE VIEW message_phone AS
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


/*INSERT INTO public.phone("alias", number, created_on) VALUES ('My French Number', '+33644645117', now());*/

/*INSERT INTO public.phone("alias", number, created_on) VALUES ('My 2nd French Number', '+33644648641', now());*/