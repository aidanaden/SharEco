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

// Get user by username and password
const getUserByUsernameAndPassword = async (username, password) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."user" WHERE username = $1 AND password = $2`,
      [username, password]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Create a user
// User will be created with isBanned = false, likedItem & wishList = []
// Each user will not be banned and have an empty likedItem and wishList upon creation
const createUser = async (
  password,
  email,
  contactNumber,
  displayName,
  username
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."user" 
        (username, password, email, "contactNumber", "userPhotoUrl", "isBanned", "likedItem", "wishList", "displayName", "aboutMe") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`,
      [username, password, email, contactNumber, "", false, [], [], displayName, ""]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update user
const updateUser = async (
  oldUsername,
  newUsername,
  password,
  email,
  contactNumber,
  userPhotoUrl,
  isBanned,
  likedItem,
  wishList,
  displayName,
  aboutMe
) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" 
      SET username = $2, 
      password = $3,
      email = $4,
      "contactNumber" = $5,
      "userPhotoUrl" = $6,
      "isBanned" = $7,
      "likedItem" = $8,
      "wishList" = $9,
      "displayName" = $10,
      "aboutMe" = $11
      WHERE "username" = $1
      RETURNING *`,
      [
        oldUsername,
        newUsername,
        password,
        email,
        contactNumber,
        userPhotoUrl,
        isBanned,
        likedItem,
        wishList,
        displayName,
        aboutMe,
      ]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updateAccountUser = async (username, email, contactNumber) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."user" SET email = $1, "contactNumber" = $2 WHERE username = $3 RETURNING *`,
      [email, contactNumber, username]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
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
  getUserByUsernameAndPassword,
  createUser,
  updateUser,
  deleteUser,
  updateAccountUser,
  getUserByUsername,
};
