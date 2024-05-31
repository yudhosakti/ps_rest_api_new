const { response } = require('express');
const itemModel = require('../models/item');
const globalFunction = require('./data/global_function');
const fs = require('fs');
const host = require('../config/host_local')
const itemData = require('./data/item_data')

const getAllItem = async(req,response)=>{
    const {page} = req.params;
    try {
    const [data] = await itemModel.getAllItem();
    let dataFinal = [];
    let dataTemp = [];
    for (let index = 0; index < data.length; index++) {
        dataTemp.push(data[index]);
        if (dataTemp.length == 25 || index+1>=data.length) {
            dataFinal.push(dataTemp);
            dataTemp = [];
        }
        
    }
    if (page == undefined) {
        response.json({
            paginate: ({
                max_page : dataFinal.length,
                current_page : 1,
                total_item_page : dataFinal[0].length
            }),
            data: dataFinal[0]
        })
    } else {
   
      if (parseInt(page) <=0 || parseInt(page) > dataFinal.length ) {
          response.status(500).json({
            message: 'Data Not Found'
          })
      } else {
        response.json({
            paginate: ({
                max_page : dataFinal.length,
                current_page : parseInt(page),
                total_item_page : dataFinal[parseInt(page)-1].length
            }),
            data: dataFinal[parseInt(page)-1] 
        })
     }
    }
    } catch (error) {
        response.status(500).json({
            message : error
        })    
    }
   
}

const getSingleItemDetail = async(req,response)=> {
    try {
    const {id} = req.params;
    const [data] = await itemModel.getSingleItem(id);
    const [dataRent] = await itemModel.getAllRentSingleItem(id);
    const [dataReview] = await itemModel.getAllReviewSingleItem(id);
    let dataRentCustom = [];
    let dataReviewCustom = [];
    let dataFinal = [];
    if (data.length == 0) {
        response.json({
            data: "Item not Found"
        }) 
    } else {
        for (let index = 0; index < dataRent.length; index++) {
            dataRentCustom.push({
                id_rent: dataRent[index].id_sewa,
                id_user: dataRent[index].id_user,
                name: dataRent[index].name,
                avatar: dataRent[index].avatar,
                date: {
                    start: globalFunction.formatTanggal(dataRent[index].tanggal_sewa),
                    end: globalFunction.formatTanggal(dataRent[index].tanggal_kembali)

                },
                price: globalFunction.rentPriceCalculate(dataRent[index].tanggal_kembali,dataRent[index].tanggal_sewa,dataRent[index].harga_sewa) 
            })
            
        }

        for (let index = 0; index < dataReview.length; index++) {
            dataReviewCustom.push({
                id_review: dataReview[index].id_review,
                id_user: dataReview[index].id_user,
                name: dataReview[index].name,
                avatar: dataReview[index].avatar,
                message: dataReview[index].message,
                rate: dataReview[index].rate,
                review_at: globalFunction.formatTanggal(dataReview[index].review_at) 
            })
            
        }
        dataFinal.push({
            id_item: data[0].id_barang,
                name: data[0].nama_barang,
                image: data[0].gambar_barang,
                type: data[0].jenis_barang,
                deskripsi: data[0].deskripsi_barang,
                stock: data[0].stock,
                price: data[0].harga_sewa,
                rating: data[0].rating,
                all_rent: dataRentCustom,
                all_review: dataReviewCustom
        })

        response.json({
            data: dataFinal[0]
        }) 
    }
    
    } catch (error) {
        response.status(500).json({
            message : error
        })   
    }
    
    
}

const createItem = async(req,response)=> {
    const dataInsert = req.body;
    let image = '';
    if (req.file) {
        image = host.local+req.file.path.replace(/\\/g, '/'); 
    }
    try {
      await itemModel.createItem(dataInsert.name,image,dataInsert.tipe,dataInsert.deskripsi,dataInsert.stock,dataInsert.harga).then(()=> {
        response.json({
            message: 'Data Inserted',
            data: dataInsert
        })
      })
    } catch (error) {
        if (image != '') {
            let path = image
        const separated = path.split(host.local)
        fs.unlink(separated[1],(err) => {
            if (err) {
                console.log(err)
                }else{
                console.log("Berhasil Hapus")
                }
                })
        }
        
        response.status(500).json({
            message : error
        })   
    }
}

const deleteItem = async(req,response) => {
    const {id} = req.params;
    try {
        await itemModel.getSingleItem(id).then(async(value)=>{
            const [data] = value
            if (data.length == 0) {
                response.json({
                    data: "Item not Found"
                }) 
            } else {
                if (data[0].gambar_barang != '' || data[0].gambar_barang != null) {
                    let path = data[0].gambar_barang
                    const separated = path.split(host.local)
                    fs.unlink(separated[1],(err) => {
                        if (err) {
                          console.log(err)
                        }else{
                         console.log("Berhasil Hapus")
                        }
                    })
                }
                await itemModel.deleteItem(id).then(()=> {
                    response.json({
                        message: 'Delete Item Success',
                        id_deleted: id
                    })
                })
            }
          
        })
       
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const updateItem = async(req,response) => {
    const {id} = req.params;
    const dataUpdate = req.body;
    let imageURL = ''
    if (req.file) {
        imageURL = host.local+req.file.path.replace(/\\/g, '/');
    }
    try {
        await itemModel.getSingleItem(id).then(async(value)=>{
            const [data] = value
            console.log(imageURL)
            if (data.length == 0) {
                if (imageURL != '') {
                    let path = imageURL
                const separated = path.split(host.local)
                fs.unlink(separated[1],(err) => {
                    if (err) {
                        console.log(err)
                        }else{
                        console.log("Berhasil Hapus")
                        }
                        })
                }
                response.status(404).json({
                    message :  'Item Not Found'
                }) 
            } else {
                if (imageURL != '' &&  data[0].gambar_barang != null) {
                    let path = data[0].gambar_barang
                    const separated = path.split(host.local)
                    fs.unlink(separated[1],(err) => {
                        if (err) {
                          console.log(err)
                        }else{
                         console.log("Berhasil Hapus")
                        }
                    })
                }
                await itemModel.updateItem(id,dataUpdate.name,imageURL,dataUpdate.tipe,dataUpdate.deskripsi,dataUpdate.stock,dataUpdate.harga).then(()=> {
                    response.json({
                        message: 'Update Item Success',
                        id_updated : id,
                        data: dataUpdate
                    })
                })
            }
            
        })
       
    } catch (error) {
        if (imageURL != '') {
            let path = imageURL
        const separated = path.split(host.local)
        fs.unlink(separated[1],(err) => {
            if (err) {
                console.log(err)
                }else{
                console.log("Berhasil Hapus")
                }
                })
        }
        response.status(500).json({
            message : error
        }) 
    }
}

const createReview = async(req,response) => {
    const dataInsert = req.body
    try {
        await itemModel.createReview(dataInsert.id_barang,dataInsert.id_user,dataInsert.message,dataInsert.rate,globalFunction.getDateNow()).then(() => {
            response.json({
                message: "Review Added",
                data: dataInsert
            })
        })
        
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const updateReview = async(req,response) => {
    const dataInsert = req.body
    try {
        const [data] = await itemModel.getSingleReviewById(dataInsert.id_review)
        if (data.length == 0) {
            response.status(404).json({
                message :  'Review Not Found'
            }) 
        } else {
            await itemModel.updateReview(dataInsert.id_review,dataInsert.message,dataInsert.rate,globalFunction.getDateNow()).then(()=> {
                response.json({
                    message: "Review Updated",
                    data: dataInsert
                })
            })
        }
        
        
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const deleteReview = async(req,response) => {
    const dataInsert = req.body

    try {
        const [data] = await itemModel.getSingleReviewById(dataInsert.id_review)
        if (data.length == 0) {
            response.status(404).json({
                message :  'Review Not Found'
            }) 
        } else {
            await itemModel.deleteReview(dataInsert.id_review).then(()=> {
                response.json({
                    message: "Review Deleted",
                    data: dataInsert
                })
            })
        }
        
        
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}





module.exports = {
    getAllItem,
    getSingleItemDetail,
    createItem,
    deleteItem,
    updateItem,
    createReview,
    updateReview,
    deleteReview
}