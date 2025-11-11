 const pool = require("../db/index");
 
    exports.findUserByEmailOrPhone = async (email, full_phone) => {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR full_phone = $2",
      [email, full_phone]
    );

   
    return existingUser.rows[0] || null;

};



