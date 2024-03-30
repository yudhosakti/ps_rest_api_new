const { response } = require('express');
const userModel = require('../models/user');


const getALlUser =async (req,response)=> {
    const {page} = req.params; 
    try {
    const [data] = await userModel.getAllUser(); 
    let dataFinal = [];
    let dataTemp = [];
    for (let index = 0; index < data.length; index++) {
        dataTemp.push({
            uid: data[index].id_user,
            email: data[index].email,
            name: data[index].name
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
        let dataResponse = {}
        let penyewaan = []
        let tempData = []
        let idUser = ''
        for (let index = 0; index < data.length; index++) {
            idUser = data[index].id_user;
            if (!tempData.includes(idUser)) {
                tempData.push(idUser);
                for (let index = 0; index < data.length; index++) {
                   penyewaan.push({
                     id_sewa: data[index].sewa,
                     id_barang: data[index].id_barang,
                     nama_barang: data[index].nama_barang,
                     status: data[index].status,
                     tanggal_sewa: data[index].tanggal_sewa,
                     tanggal_kembali: data[index].tanggal_kembali,
                     harga: Math.abs(data[index].tanggal_kembali - data[index].tanggal_sewa) * data[index].harga_sewa
                   })
                }
                
            }    
        }
        dataResponse = {
            id_user: data[0].id_user,
            nama_user: data[0].name,
            sewa : penyewaan
        }
        response.json({
            data: dataResponse
        })

    } catch (error) {
        response.status(500).json({
            message : error
        })    
    }
}

const createNewUser =async (req,response) => {
    const dataInsert = req.body;
    try {
      await userModel.createUser(dataInsert.uid,dataInsert.email,dataInsert.name).then(()=> {
        response.json({
            message: "Data Inserted",
            data: req.body
          })
      })
      
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
    
}
const deleteSingleUser = async (req,response) => {
    const {id} = req.params;
    try {
        await userModel.deleteUser(id).then(()=> {
            response.json({
                message: "Delete Success",
                id_deleted: id
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const updateSingleUser = async (req,response)=> {
    const {id} = req.params;
    const dataUpdate = req.body;
    try {
       await userModel.updateUser(id,dataUpdate.name).then(()=> {
        response.json({
            message: 'Data Update Success',
            id_updated: id,
            data:req.body
        })
       })
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
    updateSingleUser
}