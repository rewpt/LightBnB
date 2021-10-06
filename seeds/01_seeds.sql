INSERT INTO users (name, email, password)
VALUES ('John Smith', 'john_smith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Milos Raonic', 'milos333@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Karen Richardson', 'karen88@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Agatha Christia', 'agatha@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url,
cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, 
number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Speed Lamp', 'Description', 'https://images.freeimages.com/images/small-previews/ab0/house-1223067.jpg',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 86223, 2, 3, 4, 'Canada', '22 Drive Avenue',
'Winnipeg', 'Manitoba', 'Q2F4J0', 'true'),
(3, 'Blank Corner', 'Description', 'https://images.freeimages.com/images/small-previews/ab0/house-1223067.jpg',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 9434, 1, 1, 3, 'Canada', '542 Crescent Drive',
'Toronto','Ontario', 'N2M3D5', 'true'),
(4, 'Habit mix', 'Description', 'https://images.freeimages.com/images/small-previews/ab0/house-1223067.jpg',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 78796, 4, 2, 5, 'Canada', '11 Oval Street',
'Ajax', 'Ontario', 'E2A9F4', 'true'),
(2, 'Headed know', 'Description', 'https://images.freeimages.com/images/small-previews/ab0/house-1223067.jpg',
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 57721, 2, 5, 1, 'Canada', '99 Avenue Road',
'Hamilton', 'Ontario', 'J1W3R6', 'true');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 3), 
('2019-01-04', '2019-02-01', 2, 3),
('2012-03-04', '2013-05-01', 1, 4),
('2015-01-19', '2015-02-01', 2, 3),
('2022-01-06', '2023-04-01', 2, 3),
('2021-10-01', '2021-10-14', 1, 1);   

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 3, 1, 5, 'messages'),
(3, 4, 1, 3, 'messages'),
(1, 3, 4, 4, 'messages'),
(4, 2, 1, 2, 'messages'); 