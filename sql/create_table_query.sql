#CREATE DATABASE room_occupancy DEFAULT CHARACTER SET 'utf8';

USE room_occupancy;

CREATE TABLE `rooms` (
	`secretId` VARCHAR(36),
    `name` TINYTEXT,
    `isOccupied` BOOLEAN,
	PRIMARY KEY (`secretId`) 
);