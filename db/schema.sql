CREATE DATABASE campshare;

CREATE TABLE campsites(
    id SERIAL PRIMARY KEY,
    name TEXT,
    location TEXT,
    image_url TEXT, 
    description TEXT,
    thing_to_do TEXT,
    user_id INTEGER
);

INSERT INTO campsites 
(name, location, image_url, description, thing_to_do)
VALUES ('Tidal River', 'Wilson Prom', 'https://sunburymacedonranges.starweekly.com.au/wp-content/uploads/sites/6/2023/07/parksvic_344388_01.jpg', 'nice view', 'visit Squeaky Beach');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT,
    password_digest TEXT
);

-- Create 2 new columns for image 1 + 2

ALTER TABLE campsites 
ADD image_url_1 TEXT;

ALTER TABLE campsites 
ADD image_url_2 TEXT;

-- Create new table for comment

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    name TEXT,
    date VARCHAR(8) DEFAULT TO_CHAR(NOW(), 'DD/MM/YY'),
    comment TEXT,
    user_id INTEGER,
    campsite_id INTEGER
);

INSERT INTO comments
(name, date, comment, user_id, campsite_id)
VALUES ('ben', '24/1/24', 'nice river to swim', 1, 8);
