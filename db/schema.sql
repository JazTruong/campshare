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