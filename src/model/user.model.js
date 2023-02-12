const db = require('../config/db')
const userModel = {
  // get all user
  selectAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM seller', (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  register: (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
      const query = {
        text: `INSERT INTO seller
                (   
                    id_seller,
                    name,
                    email,
                    password
                )
                VALUES (
                    $1, $2, $3, $4  
                )`,
        values: [data.id, data.name, data.email, data.password],
      };
      db.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  checkEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM seller WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },
}
module.exports = userModel