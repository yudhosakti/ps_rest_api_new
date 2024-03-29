const userModel = require('../models/user');


const getALlUser =async (req,response)=> {
    try {
    const [data] = await userModel.getAllUser(); 
    response.json({
        data: data
    })
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

module.exports = {
    getALlUser,
    getSingleUser,
    getRentPsSingleUser,
    createNewUser
}