const db = require('../config/db')
const productModel = {
  // get all user
  selectAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM product', (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  selectProduct: (product_name) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM product where product_name='${product_name}'`, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  insert: (data) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
      const query = {
        text: `INSERT INTO product
                (   
                    id_product,
                    seller,
                    product_name,
                    pricej,
                    stock,
                    photo_pub_id,
                    photo_url,
                    description,
                    priceb
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                )`,
        values: [data.id, data.seller, data.product_name, data.pricej, data.stock, data.photo_pub_id, data.photo_url, data.description, data.priceb],
      };
      db.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  selectProductbyID: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM product where id_product='${id}'`, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  selectPagination: (sort,asc,limit, offset) =>
   new Promise((resolve, reject) => {
    db.query(`SELECT * FROM product ORDER BY ${sort} ${asc} LIMIT ${limit} OFFSET ${offset}`, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  }),
  nameDetail: (name, sort,asc,limit, offset) => {
    return new Promise((resolve, reject) => {
      db.query(`select * from product where product_name ilike '%${name}%' `,
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
    })
  },
  updateAccount: ({id,product_name,pricej,stock,photo_pub_id,photo_url,description,priceb}) => {
    // console.log(id,product_name,pricej,stock,photo_pub_id,photo_url,description,priceb)
    return new Promise((resolve, reject) => {
      db.query(
       ` UPDATE product SET
       product_name = COALESCE ($1, product_name),
       pricej = COALESCE ($2, pricej),
       stock = COALESCE ($3, stock),
       photo_pub_id = COALESCE ($4, photo_pub_id),
       photo_url = COALESCE ($5, photo_url),
       description = COALESCE ($6, description),
       priceb = COALESCE ($7, priceb) 
       WHERE id_product = $8
        `,
        [product_name,pricej,stock,photo_pub_id,photo_url,description,priceb, id],(err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
          db.query(`DELETE FROM product WHERE id_product = '${id}';`, (err, res) => {
            if (err) {
              reject(err)
            }
            resolve(res)
          })
        })
      },
      selectProductSellerID: (id) => {
        return new Promise((resolve, reject) => {
          db.query(`SELECT * FROM product where seller='${id}'`, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      },
}
module.exports = productModel