const userModel = require('../model/user.model');
const { failed, success } = require('../helper/response');
const bcrypt = require("bcryptjs");
const jwtToken = require("../helper/auth.helper");
const { v4: uuid } = require("uuid");
const userController = {
    // get list user
    list: (req, res) => {
      userModel
      .selectAll()
      .then((result) => {
        success(res, result, 'success', 'get all user success')
      })
      .catch((err) => {
        failed(res, err.message, 'failed', 'get all user failed')
      })
    },
    register: (req, res) => {
        try {
          const { name, email, password } = req.body;
          const id = uuid();
    
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              failed(res, err.message, "failed", "fail hash password");
            }
            const data = {
              id,
              name,
              email,
              password: hash,
            };
            userModel
            .checkEmail(email)
            .then((result)=>{
              if(result.rowCount === 0){
                userModel
                .register(data)
              .then(() => {
                delete data.password;
                success(res, data, "success", "register success");
              })
              .catch((err) => {
                failed(res, err.message, "failed", "register fail");
              });
              }else{
                failed(res, null, 'failed', `email already taken`);
              }
            })
            .catch((err) => {
              failed(res, err.message, 'failed', `failed to check email user`);
            }) 
          });
        } catch (err) {
          failed(res, err.message, "failed", "internal server error");
        }
      },
      login: async (req, res) => {
        const { email, password } = req.body;
        userModel
          .checkEmail(email)
          .then((result) => {
            const user = result.rows[0];
            if (result.rowCount > 0) {
              bcrypt
                .compare(password, result.rows[0].password)
                .then(async (result) => {
                  if (result) {
                    const token = await jwtToken({
                      id: user.user_id,
                      email: user.email,
                    });
    
                    delete user.password;
                    delete user.avatar;
    
                    success(
                      res,
                      { token, data: user },
                      "success",
                      "login success"
                    );
                  } else {
                    // ketika password salah
                    failed(res, null, "failed", "email or password is wrong");
                  }
                });
            } else {
              //ketika username salah
              failed(res, null, "failed", "username wrong");
            }
          })
          .catch((err) => {
            failed(res, err, "failed", "internal server error");
          });
      },
}
module.exports = userController  