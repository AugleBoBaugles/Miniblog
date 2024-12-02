-- pp miniblog
CREATE DATABASE blog;
use blog;

CREATE TABLE posts(
id INT auto_increment,
author VARCHAR(50),
title VARCHAR(50),
content TEXT,
created_at DATETIME DEFAULT NOW(),

PRIMARY KEY (id)
);