 const pool = require("../db/index");
 
 // Check if user already exists
    exports.findUserByEmailOrPhone = async (email, full_phone) => {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR full_phone = $2",
      [email, full_phone]
    );

   // Return user if found, else null
    return existingUser.rows[0] || null;

};



