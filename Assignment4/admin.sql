
/*
PART 2
Design a schema (Mapping) for the following ERD.x
*/
    
CREATE DATABASE store_schema;
USE store_schema;

-- 1. User table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50),
    password VARCHAR(255) NOT NULL
);

-- 2. User phone table (multivalued attribute)
CREATE TABLE UserPhones (
    user_id INT NOT NULL,
    phone VARCHAR(20) NOT NULL,

    PRIMARY KEY (user_id, phone),

    FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
);

-- 3. Product table
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INT NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
);

CREATE USER IF NOT EXISTS
'store_manager'@'localhost'
IDENTIFIED BY 'StoreManager@123';

-- Question 14
GRANT SELECT, INSERT, UPDATE
ON store_db.*
TO 'store_manager'@'localhost';

-- Question 15
REVOKE UPDATE
ON store_db.*
FROM 'store_manager'@'localhost';

-- Question 16
GRANT DELETE
ON store_db.Sales
TO 'store_manager'@'localhost';

FLUSH PRIVILEGES;