SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS MemberDB;

USE MemberDB;

CREATE TABLE IF NOT EXISTS User (
 id INT(11) AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 password VARCHAR(255) NOT NULL,
 email VARCHAR(100) NOT NULL UNIQUE,
 Role VARCHAR(100) NOT NULL DEFAULT 'user',
 access_routermongo BOOLEAN NOT NULL DEFAULT FALSE,
 access_routersqltest BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO User (name, password, email, Role, access_routermongo, access_routersqltest) VALUES
 ('Ayasaki', '$2b$10$ENi7KsV2tnxIu2XiqUHw..U2QpsCfELP6WzCyvG5RTB/uih/Fmb/a', 'tset@gmail.com', 'admin', TRUE, TRUE),
 ('Somchai Jaidee', '999999a', 'somchai@example.com', 'user', FALSE, FALSE),
 ('Suda Rakthai', '999999a', 'suda@example.com', 'user', FALSE, FALSE),
 ('Wichai Factory Co.', '999999a', 'wichai@example.com', 'user', FALSE, FALSE);

CREATE TABLE IF NOT EXISTS Asset (
 id INT(11) AUTO_INCREMENT PRIMARY KEY,
 asset_type VARCHAR(50) NOT NULL,
 description VARCHAR(255) NOT NULL,
 value DECIMAL(15,2) NOT NULL,
 status VARCHAR(50) NOT NULL DEFAULT 'Owned',
 owner_id INT(11) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
 FOREIGN KEY (owner_id) REFERENCES User(id)
);

INSERT INTO Asset (asset_type, description, value, status, owner_id) VALUES
 ('Land', 'ที่ดินเปล่า 2 ไร่ อ.เมือง จ.เชียงใหม่', 5000000.00, 'Owned', 2),
 ('Building', 'อาคารพาณิชย์ 3 ชั้น ถนนสุขุมวิท', 15000000.00, 'Owned', 2),
 ('Vehicle', 'รถกระบะ Toyota Hilux ปี 2022', 850000.00, 'Owned', 3),
 ('Factory', 'โรงงานผลิตชิ้นส่วนอิเล็กทรอนิกส์ นิคมอุตสาหกรรม', 45000000.00, 'Owned', 4),
 ('Factory', 'โรงงานบรรจุภัณฑ์ อ.บางพลี', 12000000.00, 'Pending', 4),
 ('Other', 'เครื่องจักรผลิตอาหาร', 3000000.00, 'Transferred', 3);
