CREATE TABLE IF NOT EXISTS court_players (id serial primary key,
                                            user_id integer references users (id),
                                            court_id integer references courts (id))