const productModel = require('../model/product.model');
const { failed, success } = require('../helper/response');
const cloudinary = require('../helper/cloudinary')

const { v4: uuid } = require("uuid");
const productController = {
    // get list user
    list: (req, res) => {
        productModel
      .selectAll()
      .then((result) => {
        success(res, result, 'success', 'get all user success')
      })
      .catch((err) => {
        failed(res, err.message, 'failed', 'get all user failed')
      })
    },
    
    insert: async(req, res) => {
        try {
          const { seller, product_name, pricej, stock, description, priceb } = req.body;
          let photo;
          if (req.file) {
            photo = await cloudinary.uploader.upload(req.file.path)
          }else{
            console.log(error)
          }
          const id = uuid();
            const data = {
                id,
                seller,
                product_name,
                pricej,
                stock,
                photo_pub_id: photo.public_id,
                photo_url: photo.url,
                description,
                priceb
            };
            console.log(data)
            productModel
            .selectProduct(product_name)
            .then((result)=>{
              if(result.rowCount === 0){
                productModel
              .insert(data)
              .then(() => {
                success(res, data, "success", "insert success");
              })
              .catch((err) => {
                failed(res, err.message, "failed", "insert fail");
              });
              }else{
                failed(res, null, 'failed', `name of product already taken`);
              }
            })
            .catch((err) => {
              failed(res, err.message, 'failed', `failed to check name of product`);
            }) 
        } catch (err) {
          failed(res, err.message, "failed", "internal server error");
        }
      },
    listbyID: (req, res) => {
        const id = req.params.id
        productModel
      .selectProductbyID(id)
      .then((result) => {
        success(res, result, 'success', 'get all product success')
      })
      .catch((err) => {
        failed(res, err.message, 'failed', 'get all product failed')
      })
    },
    listLimit: (req, res) => {
        const sort = req.query.sort
        const asc = req.query.asc
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const offset = (page - 1) * limit
        productModel
          .selectPagination(sort,asc,limit, offset)
          // console.log(listAll)
          .then((result) => {
            success(res, result, 'success', 'get all product success')
          })
          .catch((err) => {
            failed(res, err.message, 'failed', 'get all product failed')
          })
      },
      detailname: (req, res) => {
        const name = req.params.username
        productModel
          .nameDetail(name)
          .then((result) => {
            success(res, result, 'success', 'get all product success')
          })
          .catch((err) => {
            failed(res, err.message, 'failed', 'get all product failed')
          })
      },
      update: async(req, res) => {
        const id = req.params.id
        // const image=req.file.filename
        // eslint-disable-next-line camelcase
        const { product_name, pricej, stock, description, priceb } = req.body
        // let photo;
        // if (req.file) {
        //     photo = await cloudinary.uploader.upload(req.file.path);
        //   }
        //   productModel
        //   .selectProductbyID(id)
        //   .then(async (results) => {
        //     const datas = await results.rows[0]
        //     // console.log("datas",datas)
        //     // console.log(datas)
        //     if(photo !== undefined) {
        //     //   console.log('1')
        //       const public_id = datas.photo_pub_id;
        //     //   console.log(public_id)
        //       if(public_id !== null) {
        //         // console.log('test')
        //         await cloudinary.uploader.destroy(public_id);
        //       }
        //     }
        const data = {
            id,
            product_name,
            pricej,
            stock,
            // photo_pub_id: photo.public_id,
            // photo_url: photo.url,
            description,
            priceb}
          console.log(data)
        productModel
          .updateAccount(data)
          .then((result) => {
            success(res, result, 'success', 'update product success')
          })
          .catch((err) => {
            failed(res, err.message, 'failed', 'update product failed')
          })
        // })
        // .catch((err) => {
        //     failed(res, err.message, 'failed', 'delete product failed')
        //   })
      },
      updatePhoto: async(req, res) => {
        const id = req.params.id
        // const image=req.file.filename
        // eslint-disable-next-line camelcase
        // const { product_name, pricej, stock, description, priceb } = req.body
        let photo;
        if (req.file) {
            photo = await cloudinary.uploader.upload(req.file.path);
          }
          productModel
          .selectProductbyID(id)
          .then(async (results) => {
            const datas = await results.rows[0]
            // console.log("datas",datas)
            // console.log(datas)
            if(photo !== undefined) {
            //   console.log('1')
              const public_id = datas.photo_pub_id;
            //   console.log(public_id)
              if(public_id !== null) {
                // console.log('test')
                await cloudinary.uploader.destroy(public_id);
              }
            }
        const data = {
            id,
            // product_name,
            // pricej,
            // stock,
            photo_pub_id: photo.public_id,
            photo_url: photo.url,
            // description,
            // priceb
          }
          console.log("wawwa",data)
        productModel
          .updateAccount(data)
          .then((result) => {
            success(res, result, 'success', 'update product success')
          })
          .catch((err) => {
            failed(res, err.message, 'failed', 'update product failed')
          })
          })
        },
      destroy:async (req, res) => {
        const id = req.params.id;
        const data = await productModel.selectProductbyID(id);
        const public_id = data.rows[0].photo_pub_id
        console.log(public_id) 
        if(public_id !== null) {
        await cloudinary.uploader.destroy(public_id);
        }
        productModel
          .delete(id)
          .then((result) => {
            success(res, result, 'success', 'delete product success')
          })
          .catch((err) => {
            failed(res, err.message, 'failed', 'delete product failed')
          })
      },
      listbySellerID: (req, res) => {
        const id = req.params.id
        productModel
      .selectProductSellerID(id)
      .then((result) => {
        success(res, result, 'success', 'get all product success')
      })
      .catch((err) => {
        failed(res, err.message, 'failed', 'get all product failed')
      })
    },
    
      
}
module.exports = productController  