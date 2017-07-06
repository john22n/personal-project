CREATE TABLE IF NOT EXISTS users (
    id serial primary key,
    google_id text,
    username text,
    first_name text,
    last_name text,
    email text,
    picture text
)