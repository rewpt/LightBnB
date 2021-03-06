const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool} = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const values = [email];
  const queryString = `
  SELECT * 
  FROM users 
  WHERE email = $1;`
  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
    .catch(() => {
      return null
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [id];
  const queryString = `
  SELECT * FROM users WHERE id = $1;`
  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
    .catch(() => {return null});
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.password, user.email];
  const queryString =  `
  INSERT INTO users (name, password, email)
  VALUES ($1, $2, $3) returning *`
  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    }).catch(() => {
      return null
    });
  // Commented LHL former code
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getFulfilledReservations = function(guest_id, limit = 10) {
  values = [guest_id, limit]
  const queryString = 
  `SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2`;
  return pool.query(queryString, values)
    .then((res) => {return res.rows;})
    .catch((err) => {err.message;});
}
exports.getFulfilledReservations = getFulfilledReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id`;
  const objVal = []
  for (key in options) {
    const val = options[key];
    if(val)
    objVal.push(val);
  }
  if (objVal.length >= 1) {
    queryString += ` WHERE`;
  }
  
  // 3

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    const connector = queryParams.length > 1 ? 'AND' : '';
    queryString += `${connector} owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}00`);
    const connector = queryParams.length > 1 ? 'AND' : '';
    queryString += `${connector} cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}00`);
    const connector = queryParams.length > 1 ? 'AND' : '';
    queryString += `${connector} cost_per_night <= $${queryParams.length} `;
  }

  // 4
  queryString += ` GROUP BY properties.id `
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  // 5

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
 // 1
 const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url,
property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms,
property.country, property.street, property.city, property.province, property.post_code];
 // 2
 let queryString =   
 ` INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,
  cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country,
  street, city, province, post_code)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *;
 `;

 return pool.query(queryString, queryParams)
 .then(res => {
   return res.rows[0];
   })
 .catch(err => console.log(err))
}
exports.addProperty = addProperty;

const addReservation = function(reservation) {
  /*
   * Adds a reservation from a specific user to the database
   */
  return pool.query(`
    INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ($1, $2, $3, $4) RETURNING *;`, [reservation.start_date, reservation.end_date, reservation.property_id, reservation.guest_id])
  .then((res) => {
    res.rows[0];
  })
  .catch((err) => console.log(err))
}

exports.addReservation = addReservation;

//  Gets upcoming reservations
//
const getUpcomingReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const params = [guest_id, limit];
  return pool.query(queryString, params)
    .then(res => res.rows);
}

exports.getUpcomingReservations = getUpcomingReservations;

//
//  Updates an existing reservation with new information
//
const updateReservation = function(reservationData) {
  // base string
  let queryString = `UPDATE reservations SET `;
  const queryParams = [];
  if (reservationData.start_date) {
    queryParams.push(reservationData.start_date);
    queryString += `start_date = $1`;
    if (reservationData.end_date) {
      queryParams.push(reservationData.end_date);
      queryString += `, end_date = $2`;
    }
  } else {
    queryParams.push(reservationData.end_date);
    queryString += `end_date = $1`;
  }
  queryString += ` WHERE id = $${queryParams.length + 1} RETURNING *;`
  queryParams.push(reservationData.reservation_id);
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => console.error(err));
}

exports.updateReservation = updateReservation;

//
//  Deletes an existing reservation
//
const deleteReservation = function(reservationId) {
  const queryParams = [reservationId];
  const queryString = `DELETE FROM reservations WHERE id = $1`;
  return pool.query(queryString, queryParams)
    .then(() => console.log("Success"))
    .catch((err) => console.error(err));
}

exports.deleteReservation = deleteReservation;

const getIndividualReservation = function(reservationId) {
  const queryString = `SELECT * FROM reservations WHERE id = $1`;
  return pool.query(queryString, [reservationId])
    .then(
      res => {
        return res.rows[0]});
}

exports.getIndividualReservation = getIndividualReservation;

const getReviewsByProperty = function(propertyId) {
  const queryString = `
    SELECT property_reviews.id, property_reviews.rating AS review_rating, property_reviews.message AS review_text, 
    users.name, properties.title AS property_title, reservations.start_date, reservations.end_date
    FROM property_reviews
    JOIN reservations ON reservations.id = property_reviews.reservation_id  
    JOIN properties ON properties.id = property_reviews.property_id
    JOIN users ON users.id = property_reviews.guest_id
    WHERE properties.id = $1
    ORDER BY reservations.start_date ASC;
  `
  const queryParams = [propertyId];
  return pool.query(queryString, queryParams).then(res => res.rows)
}

exports.getReviewsByProperty = getReviewsByProperty;


const addReview = function(review) {
  const queryString = `
    INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [review.guest_id, review.property_id, review.id, parseInt(review.rating), review.message];
  return pool.query(queryString, queryParams).then(res => res.rows);
}

exports.addReview = addReview;