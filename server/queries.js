const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Get all users
const getUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM "sharEco-schema"."user"');
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Get a user by ID
const getUserById = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."user" 
    WHERE "userId" = $1`,
      [userId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."user" 
      WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Create a user
const createUser = async (
  username,
  password,
  email,
  contactNumber,
  userPhotoUrl,
  displayName
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."user" 
      (username, password, email, "contactNumber", "userPhotoUrl", "isBanned", "likedItem", "wishList", "displayName") values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [
        username,
        password,
        email,
        contactNumber,
        userPhotoUrl,
        false,
        [],
        [],
        displayName,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update user
const updateUser = async (
  userId,
  username,
  password,
  email,
  contactNumber,
  userPhotoUrl,
  isBanned,
  likedItem,
  wishList,
  displayName
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
      SET username = $1, 
      password = $2,
      email = $3,
      "contactNumber" = $4,
      "userPhotoUrl" = $5,
      "isBanned" = $6,
      "likedItem" = $7,
      "wishList" = $8,
      "displayName" = $9
      WHERE "userId" = $10
      RETURNING *`,
      [
        username,
        password,
        email,
        contactNumber,
        userPhotoUrl,
        isBanned,
        likedItem,
        wishList,
        displayName,
        userId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const result = await pool.query(
      `DELETE FROM "sharEco-schema"."user" 
      WHERE "userId" = $1
      RETURNING *`,
      [userId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername,
};
