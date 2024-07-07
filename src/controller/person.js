const jwt = require('jsonwebtoken');
const userModel = require('../models/person');
const globalFunction = require('./data/global_function')
const host = require('../config/host_local')
const fs = require('fs');


const getALlUser =async (req,response)=> {
    const {page} = req.params; 
    const filter = req.query.filter
    let userFilter = ''
    if (filter == 'admin' || filter == 'user') {
        userFilter = filter
    }
    try {
    const [data] = await userModel.getAllUser(userFilter); 
    let dataFinal = [];
    let dataTemp = [];
    for (let index = 0; index < data.length; index++) {
        dataTemp.push({
            uid: data[index].id_user,
            email: data[index].email,
            name: data[index].name,
            avatar: data[index].avatar,
            bookmark: data[index].bookmark_count,
            rent: data[index].rent_count,
            role: data[index].role
        });
        if (dataTemp.length == 25 || index+1 >= data.length) {
            dataFinal.push(dataTemp)
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
    }else{
        if (parseInt(page) <=0 || parseInt(page) > dataFinal.length) {
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

const getSingleUser = async (req,response) => {
    const {id} = req.params;
    try {
       const [data] = await userModel.getSingleUser(id);
       response.json({
          data: data[0]
       })
    } catch (error) {
        response.status(500).json({
            message : error
        })    
    }
}

const getRentPsSingleUser = async (req,response)=> {
    const {id} = req.params;
    try {
        const [data] = await userModel.getRentPsSingleUser(id);
        if (data.length == 0) {
            response.status(404).json({
                message:"User doesnt have rent"
            })
        } else {
            let dataResponse = {}
        let penyewaan = []
        let tempData = []
        let idUser = ''
        let idTransaksi = ''
        for (let index = 0; index < data.length; index++) {
            if (idTransaksi == '') {
                idTransaksi = data[index].id_transaksi
            }
            
            if (data[index].id_transaksi != idTransaksi) {
                tempData.push({
                    id_sewa: data[index-1].id_sewa,
                    id_transaksi: data[index-1].id_transaksi,
                    status: data[index].status,
                    tanggal_sewa: globalFunction.formatTanggal(data[index-1].tanggal_sewa),
                    tanggal_kembali: globalFunction.formatTanggal(data[index-1].tanggal_kembali),
                    harga: globalFunction.rentPriceCalculate(data[index-1].tanggal_kembali,data[index-1].tanggal_sewa,data[index-1].harga_sewa),
                    sewa: penyewaan
                })
                penyewaan = []
                penyewaan.push({
                    id_barang: data[index].id_barang,
                    name: data[index].nama_barang,
                    image:data[index].gambar_barang,
                    quantity: data[index].quantity
                })
                if (index+1 == data.length) {
                    tempData.push({
                    id_sewa: data[index].id_sewa,
                    id_transaksi: data[index].id_transaksi,
                    status: data[index].status,
                    tanggal_sewa: globalFunction.formatTanggal(data[index].tanggal_sewa),
                    tanggal_kembali: globalFunction.formatTanggal(data[index].tanggal_kembali),
                    harga: globalFunction.rentPriceCalculate(data[index].tanggal_kembali,data[index].tanggal_sewa,data[index].harga_sewa),
                    sewa: penyewaan
                    })
                }
                idTransaksi = data[index].id_transaksi
                
            }else if(index+1 == data.length){
                penyewaan.push({
                    id_barang: data[index].id_barang,
                    name: data[index].nama_barang,
                    image:data[index].gambar_barang,
                    quantity: data[index].quantity
                })
                tempData.push({
                    id_sewa: data[index].id_sewa,
                    id_transaksi: data[index].id_transaksi,
                    status: data[index].status,
                    tanggal_sewa: globalFunction.formatTanggal(data[index].tanggal_sewa),
                    tanggal_kembali: globalFunction.formatTanggal(data[index].tanggal_kembali),
                    harga: globalFunction.rentPriceCalculate(data[index].tanggal_kembali,data[index-1].tanggal_sewa,data[index-1].harga_sewa),
                    sewa: penyewaan
                })

            }
            else{
                penyewaan.push({
                    id_barang: data[index].id_barang,
                    name: data[index].nama_barang,
                    image:data[index].gambar_barang,
                    quantity: data[index].quantity
                })
            }   
        }
        response.json({
            data: tempData
        })
        }
        

    } catch (error) {
        response.status(500).json({
            message : error
        })    
    }
}

const loginUser = async (req,response) =>{
    const email = req.body.email
    const password = req.body.password

    console.log(email,password)

    try {
        const [data] = await userModel.loginUser(email,password)
        if (data.length == 0) {
            response.status(404).json({
                message: "User Not Found"
            })
        } else {
            var payload = {
                id_user: data[0].id_user,
                name: data[0].name,
                email:data[0].email,
            }
            var privateKey = "yudho"
            const expired = 60 * 60 *24 * 7
            var token = jwt.sign(payload, privateKey, {expiresIn: expired});
            response.json({
                message: "Login Succes",
                data: {
                    id_user: data[0].id_user,
                    name: data[0].name,
                    email:data[0].email,
                    avatar: data[0].avatar,
                    rent: data[0].rent_count,
                    bookmark: data[0].bookmark_count
                },
                token: token
            })
        }
        
    } catch (error) {
        response.json({
            message: error
        })
    }
}

const createNewUser =async (req,response) => {
    const dataInsert = req.body;
    let pwdTrimp = dataInsert.password.trim()
    try {
      if (dataInsert.email == undefined || dataInsert.name == undefined || dataInsert.password == undefined) {
        response.status(500).json({
            message : "Data Not Complete"
        }) 
      }else if(dataInsert.email == '' || dataInsert.name == '' || dataInsert.password == ''){
        response.status(500).json({
            message : "Data Cannot Empty"
        }) 
      }else if(pwdTrimp.length < 8){
        response.status(500).json({
            message : "Character Pada Password Minimal 8 Character"
        })
      } 
      else {
        await userModel.createUser(dataInsert.email,dataInsert.name,dataInsert.password).then((value)=> {
            response.json({
                message: "Data Inserted",
                data: req.body
              })
          })
      }
      
      
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
    
}

const createNewAdmin =async (req,response) => {
    const dataInsert = req.body;
    let pwdTrimp = dataInsert.password.trim()
    try {
        if (dataInsert.email == undefined || dataInsert.name == undefined || dataInsert.password == undefined) {
            response.status(500).json({
                message : "Data Not Complete"
            }) 
          }else if(dataInsert.email == '' || dataInsert.name == '' || dataInsert.password == ''){
            response.status(500).json({
                message : "Data Cannot Empty"
            }) 
          }else if(pwdTrimp.length < 8){
            response.status(500).json({
                message : "Character Pada Password Minimal 8 Character"
            })
          }else{
            await userModel.createAdmin(dataInsert.email,dataInsert.name,dataInsert.password).then((value)=> {
                response.json({
                    message: "Data Inserted",
                    data: req.body
                  })
              })

          } 
      
      
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
    
}
const deleteSingleUser = async (req,response) => {
    const {id} = req.params;
    try {
        const [data] = await userModel.getSingleUser(id)
        if (data.length == 0) {
            response.status(404).json({
                message :  'User Not Found'
            }) 
        } else {
            await userModel.deleteUser(id).then(()=> {
                response.json({
                    message: "Delete Success",
                    id_deleted: id
                })
            })
        }
       
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const updateSingleUser = async (req,response)=> {
    const {id} = req.params;
    const dataUpdate = req.body;
    let avatar = ''
    try {
      const [data] = await userModel.getSingleUser(id)
      if (data.length == 0) {
        response.status(404).json({
            message :  'User Not Found'
        }) 
      } else {
        if (req.file) {
            avatar = host.local+req.file.path.replace(/\\/g, '/'); 
            console.log('File path:', avatar);
        }

        if (data[0].avatar != null && avatar != '') {
            let urlFull = data[0].avatar
            const pathFile = urlFull.split(host.local) 
            fs.unlink(pathFile[1],(err) => {
               if (err) {
                 console.log("Internal Error")
               }else{
                 console.log("Success")
               }
            })
        }

        await userModel.updateUser(id,dataUpdate.name,avatar).then(()=> {
            response.json({
                message: 'Data Update Success',
                id_updated: id,
                data:dataUpdate
            })
           })

      }
       
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const getAllBookmarkById = async(req,response) => {
    const dataInsert = req.body
   try {
    const [data] = await userModel.getAllBookmarkByIdUser(dataInsert.id_user)
    let dataFinal = []
    for (let index = 0; index < data.length; index++) {
        dataFinal.push({
            id_bookmark: data[index].id_bookmark,
            id_barang: data[index].id_barang,
            name: data[index].nama_barang,
            image: data[index].gambar_barang,
            type: data[index].jenis_barang,
            
        })
        
    }
    if (dataFinal.length == 0) {
        response.status(404).json({
            message: "Empty Bookmark"
        })
    } else {
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

const createBookmark = async(req,response) => {
    const dataInsert = req.body
    console.log(dataInsert)
    try {
        await userModel.createBookmark(dataInsert.id_user,dataInsert.id_barang,globalFunction.getDateNow()).then(() => {
            response.json({
                message: "Bookmark Success",
                data: dataInsert
            })
        })
        
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }


}

const deleteBookmark = async(req,response) => {
    const dataInsert = req.body
    try {
       const [data] = await userModel.getSingleBookmarkById(dataInsert.id_bookmark)
       if (data.length == 0) {
        response.status(404).json({
            message: "Bookmark Not Found"
        })
       } else {
        await userModel.deleteBookmark(dataInsert.id_bookmark).then(() => {
            response.json({
              message: "Bookmark Deleted",
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

const getSingleBookmarkByIdUser = async(req,response) => {
    const dataInsert = req.body
    try {
        const [data] = await userModel.getSingleBookmarkByIdUser(dataInsert.id_user,dataInsert.id_barang)

        if (data.length == 0) {
            response.status(404).json({
                message : 'Data Not Found'
            })
        } else {
            response.json({
                data:{
                    id_bookmark: data[0].id_bookmark,
                id_barang: data[0].id_barang,
                name: data[0].nama_barang,
                image:data[0].gambar_barang,
                type: data[0].jenis_barang
                }
                

            })
        }
        
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }
}

const getSearchPerson = async(req,response) => {
   const searchPerson = req.body
   let role = ''
   let dataFinal = []
   if (searchPerson.role == 'admin' || searchPerson.role == 'user') {
      role =searchPerson.role
   }
   try {
     const [data] = await userModel.getSearchPerson(searchPerson.person_name,role)
     if (data.length == 0) {
        response.status(404).json({
            message: "Data Not Found"
        })
     } else {
        for (let index = 0; index < data.length; index++) {
            dataFinal.push({
                id_user: data[index].id_user,
                    name: data[index].name,
                    email:data[index].email,
                    avatar: data[index].avatar,
                    rent: data[index].rent_count,
                    bookmark: data[index].bookmark_count
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
    getALlUser,
    getSingleUser,
    getRentPsSingleUser,
    createNewUser,
    deleteSingleUser,
    updateSingleUser,
    loginUser,
    createNewAdmin,
    getAllBookmarkById,
    createBookmark,
    deleteBookmark,
    getSingleBookmarkByIdUser,
    getSearchPerson
}