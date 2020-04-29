USE room_occupancy;

INSERT INTO `rooms` 
(`secretId`, `name`, `isOccupied`) 
VALUES (UUID(), 'Example Text', False);