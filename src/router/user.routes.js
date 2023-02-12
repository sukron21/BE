const express = require('express')
const { list, register, login } = require('../controller/user.controller')

const router = express.Router()

router
  .get('/userlist', list)
  .post("/register", register)
  .post("/login", login)
module.exports = router