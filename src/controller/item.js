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
    const [dataGame] = await itemModel.getAllGameByIdItem(id)
    let dataRentCustom = [];
    let dataReviewCustom = [];
    let dataFinal = [];
    let dataGameCustom = [];
    if (data.length == 0) {
        response.json({
            data: "Item not Found"
        }) 
    } else {
        for (let index = 0; index < dataRent.length; index++) {
            dataRentCustom.push({
                id_rent: dataRent[index].id_sewa,
                id_user: dataRent[index].id_user,
                order_id: dataRent[index].id_transaksi,
                name: dataRent[index].name,
                avatar: dataRent[index].avatar,
                date: {
                    start: globalFunction.formatTanggal(dataRent[index].tanggal_sewa),
                    end: globalFunction.formatTanggal(dataRent[index].tanggal_kembali)

                }, 
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
        for (let index = 0; index < dataGame.length; index++) {
            dataGameCustom.push({
                id: dataGame[index].id_game,
                name: dataGame[index].nama_game,
                image: dataGame[index].gambar_game,
                deskripsi: dataGame[index].deskripsi_game
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
                all_review: dataReviewCustom,
                all_game: dataGameCustom
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

const getAllGame = async(req,response) => {
    const page = req.query.page
    let dataFinal = []
    let dataTemp = []
    try {
        const [data] = await itemModel.getAllGame()
        if (data.length == 0) {
            response.status(404).json({
                message:"Data Not Found"
            })
        } else {
            for (let index = 0; index < data.length; index++) {
                dataTemp.push({
                    id: data[index].id_game,
                    name: data[index].nama_game,
                    image: data[index].gambar_game,
                    deskripsi: data[index].deskripsi_game
                })
                if (dataTemp.length >= 30 || index+1 >= data.length) {
                    dataFinal.push(dataTemp)
    
                    dataTemp = []
                }
                
            }
    
            if (page == undefined || !Number.isInteger(parseInt(page))) {
                response.json({
                    paginate: ({
                        max_page : dataFinal.length,
                        current_page : 1,
                        total_item_page : dataFinal[0].length
                    }),
                    data: dataFinal[0]
                })
            } else if(parseInt(page) > dataFinal.length || parseInt(page) <= 0) {
                response.status(404).json({
                    message: "Data Not Found"
                })
            }else{
                response.json({
                    paginate: ({
                        max_page : dataFinal.length,
                        current_page : parseInt(page),
                        total_item_page : dataFinal[parseInt(page)-1].length
                    }),
                    data: dataFinal[parseInt(page) -1]
                })
            }
        }
       

        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }

}

const getSearchGame = async(req,response) => {
    const dataInsert = req.body
    let dataFinal = []
    try {
        const [data] = await itemModel.getSearchGame(dataInsert.search_game)
        if (data.length == 0) {
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            for (let index = 0; index < data.length; index++) {
                dataFinal.push({
                    id: data[index].id_game,
                    name: data[index].nama_game,
                    image: data[index].gambar_game,
                    deskripsi: data[index].deskripsi_game
                })
                
            }
            response.json({
                data: dataFinal
            })
        }
        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }
}

const getAllGameByIdItem = async(req,response) => {
    const dataInsert = req.body
    let dataFinal = []
    try {
        const [data] = await itemModel.getAllGameByIdItem(dataInsert.id_barang)
        if (data.length == 0) {
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            for (let index = 0; index < data.length; index++) {
                dataFinal.push({
                    id: data[index].id_game,
                    name: data[index].nama_game,
                    image: data[index].gambar_game,
                    deskripsi: data[index].deskripsi_game
                })
                
            }
            response.json({
                data: {
                    item: {
                        id: data[0].id_barang,
                        name: data[0].nama_barang,
                        image: data[0].gambar_barang
                    },
                    games: dataFinal
                }
            })
        }
        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }
}

const getSingleGame = async(req,response) => {
    const id_game = req.query.id_game

    try {
        const [data] = await itemModel.getSingleGame(id_game)

        if (data.length == 0) {
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            response.json({
                data: {
                    id: data[0].id_game,
                    name: data[0].nama_game,
                    image: data[0].gambar_game,
                    deskripsi: data[0].deskripsi_game
                }
            })
        }
        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }

}

const getDetailGame =async (req,response) => {
   const dataInsert = req.body

   try {
    const [data] = await itemModel.getDetailGameById(dataInsert.id_game)
    let itemList = []
    if (data.length == 0) {
        response.status(404).json({
            message: "Data Not Found"
        })
    } else {
        for (let index = 0; index < data.length; index++) {
            itemList.push({
                id_item: data[index].id_barang,
                name: data[index].nama_barang,
                image: data[index].gambar_barang,
                type: data[index].jenis_barang,
                deskripsi: data[index].deskripsi_barang,
                stock: data[index].stock,
                price: data[index].harga_sewa,
                rating: data[index].rating, 
            })
            
        }
        response.json({
            data:{
                id_game: data[0].id_game,
                name: data[0].nama_game,
                image: data[0].gambar_game,
                deskripsi: data[0].deskripsi_game,
                items: itemList
            }
        })
    }
    
   } catch (error) {
    response.status(500).json({
        message : error
    })
   }
}

const createNewGame = async(req,response) => {
    const dataInsert = req.body
    let imageUrl = ''
    if (req.file) {
        imageUrl = host.local+req.file.path.replace(/\\/g, '/');
    }
    try {
        await itemModel.createNewGame(dataInsert.name,imageUrl,dataInsert.deskripsi,).then(()=> {
            response.json({
                message: "Create New Game Success",
                data: dataInsert
            })
        })
        

        
    } catch (error) {
        if (imageUrl != '') {
            let path = imageUrl
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

const updateGameData = async(req,response) => {
    const dataInsert = req.body
    let imageUrl = ''
    if (req.file) {
        imageUrl = host.local+req.file.path.replace(/\\/g, '/');
    }
    try {

        const [data] = await itemModel.getSingleGame(dataInsert.id_game)
        if (data.length == 0) {
            if (imageUrl != '') {
                let path = imageUrl
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
                message: "Game Not Found"
            })
        } else {
            if (data[0].gambar_game != null && imageUrl != '') {
                let path = data[0].gambar_game
                const separated = path.split(host.local)
                fs.unlink(separated[1],(err) => {
                    if (err) {
                      console.log(err)
                    }else{
                     console.log("Berhasil Hapus")
                    }
                })
            }
            await itemModel.updateGameData(dataInsert.id_game,dataInsert.nama,imageUrl,dataInsert.deskripsi).then(() => {
                response.json({
                    message: 'Update Game Success',
                    data: dataInsert
                })
            })
        }

        
    } catch (error) {
        if (imageUrl != '') {
            let path = imageUrl
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

const deleteGame = async(req,response) => {
    const id_game = req.query.id_game
    try {
        const [data] = await itemModel.getSingleGame(id_game)
        if (data.length == 0) {
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            if (data[0].gambar_game != '') {
                let path = data[0].gambar_game
                const separated = path.split(host.local)
                fs.unlink(separated[1],(err) => {
                    if (err) {
                      console.log(err)
                    }else{
                     console.log("Berhasil Hapus")
                    }
                })
            }
            await itemModel.deleteGame(id_game).then(()=> {
                response.json({
                    message: "Game Delete Succes",
                    id: id_game
                })
            })
        }
        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }
}

const createGameForPS = async(req,response) => {
    const dataInsert = req.body
    try {
        await itemModel.createGameForPS(dataInsert.id_game,dataInsert.id_barang,globalFunction.getDateNow()).then(()=> {
            response.json({
                message: "Success Insert",
                data: dataInsert
            })
        })
        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }
}

const deletePSGame = async(req,response) => {
    const id_ps_game = req.query.id_ps_game
    try {
        const [data] = await itemModel.getSinglePSGame(id_ps_game)
        if (data.length == 0) {
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            await itemModel.deletePSGame(id_ps_game).then(() => {
                response.json({
                    message: "Delete PS Game Success",
                    id_ps_game: id_ps_game
                })
            })
        }
       
        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    } 
}

const getSearchItem = async(req,response)=> {
    const dataInsert = req.body
    try {
        const [data] = await itemModel.getSearchItem(dataInsert.item_name)
        let dataFinal = []
        if (data.length == 0) {
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            for (let index = 0; index < data.length; index++) {
                dataFinal.push({
                    id_item: data[index].id_barang,
                name: data[index].nama_barang,
                image: data[index].gambar_barang,
                type: data[index].jenis_barang,
                deskripsi: data[index].deskripsi_barang,
                stock: data[index].stock,
                price: data[index].harga_sewa,
                rating: data[index].rating,
                })
                
            }
            response.json({
                data: dataFinal
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
    deleteReview,
    getAllGame,
    getSearchGame,
    getAllGameByIdItem,
    getSingleGame,
    getDetailGame,
    createNewGame,
    updateGameData,
    deleteGame,
    createGameForPS,
    deletePSGame,
    getSearchItem
}