const express = require('express')
const { list, insert,listbyID,listLimit,detailname,update,destroy,listbySellerID,updatePhoto  } = require('../controller/product.controler')
const {uploadPhoto} = require ('../middleware/uploadIMG')

const router = express.Router()

router
  .get('/productlist', list)
  .get('/productlist/limit', listLimit)
  .get('/productlist/limit/:username', detailname)
  .get('/productlist/:id', listbyID)
  .get('/productlist/seller/:id', listbySellerID)
  .post("/insert",uploadPhoto, insert)
  .put("/product/update/:id", update)
  .put("/product/update/photo/:id",uploadPhoto, updatePhoto)
  .delete("/product/delete/:id", destroy)
module.exports = router