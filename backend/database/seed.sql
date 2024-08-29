-- Seed the users table with initial data
INSERT INTO users (username, email, password) VALUES 
('john_doe', 'john@example.com', 'hashed_password_1'),
('jane_smith', 'jane@example.com', 'hashed_password_2');

-- Seed the journeys table with initial data
INSERT INTO journeys (title, description, location, user_id) VALUES 
('Trip to Paris', 'A wonderful trip to Paris with lots of sightseeing and food.', 'Paris, France', 1),
('Hiking Adventure', 'A thrilling hike in the mountains with breathtaking views.', 'Rocky Mountains, USA', 2);
