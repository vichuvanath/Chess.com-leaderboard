-- Schema for Chess Community Leaderboard

CREATE TABLE IF NOT EXISTS communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    community_id TEXT,
    username TEXT,
    PRIMARY KEY (community_id, username),
    FOREIGN KEY (community_id) REFERENCES communities (id)
);
