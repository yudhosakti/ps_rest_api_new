const { response } = require('express');
const rentModel = require('../models/rent')
const globalFunction = require('./data/global_function')

const getRentPsAllUser =async (req,response)=> {
    const {page} = req.params;
    console.log(page);
    try {
     const [data] = await rentModel.getAllRent();
     let dataResponseFinal = [];
     let dataResponse = [];
     for (let index = 0; index < data.length; index++) {
        dataResponse.push({
            id_sewa: data[index].id_sewa,
            user: {
                id: data[index].id_user,
                name: data[index].name,
                avatar: data[index].avatar,
                email: data[index].email
            },
            item: {
                id: data[index].id_barang,
                name: data[index].nama_barang,
                image: data[index].gambar_barang
            },
            date: {
                start: globalFunction.formatTanggal(data[index].tanggal_sewa),
                end: globalFunction.formatTanggal(data[index].tanggal_kembali)
            },
            price: globalFunction.rentPriceCalculate(data[index].tanggal_kembali,data[index].tanggal_sewa,data[index].harga_sewa)
        })
        if (dataResponse.length == 25 || index+1 >= data.length) {
            dataResponseFinal.push(dataResponse);
            dataResponse = [];
        }
        
     }
     if (page == undefined) {
        response.json({
            paginate: ({
                max_page : dataResponseFinal.length,
                current_page : 1,
                total_item_page : dataResponseFinal[0].length
            }),
            data: dataResponseFinal[0]
         })
     }else{
        if (parseInt(page) <= 0 || parseInt(page)> dataResponseFinal.length) {
            response.status(500).json({
                message: "Data Not Found"
            })
        }else{
            response.json({
                paginate: ({
                    max_page : dataResponseFinal.length,
                    current_page : parseInt(page),
                    total_item_page : dataResponseFinal[parseInt(page)-1].length
                }),
                data: dataResponseFinal[parseInt(page)-1]
             })
        }
        
     }
    
    
    } catch (error) {
        response.status(500).json({
            message : error
        })   
    }
   
}

const getRentSingle = async (req,response)=> {
    const {id} = req.params;
    try {
        const [data] = await rentModel.getSingleRent(id)
        let responseData = {};
        if (data.length == 0) {
            response.status(500).json({
                message: "Data Not Found"
            })
        } else {
            responseData = {
                id_sewa: data[0].id_sewa,
            user: {
                id: data[0].id_user,
                name: data[0].name,
                avatar: data[0].avatar,
                email: data[0].email
            },
            item: {
                id: data[0].id_barang,
                name: data[0].nama_barang,
                image: data[0].gambar_barang
            },
            date: {
                start: globalFunction.formatTanggal(data[0].tanggal_sewa),
                end: globalFunction.formatTanggal(data[0].tanggal_kembali)
            },
            price: globalFunction.rentPriceCalculate(data[0].tanggal_kembali,data[0].tanggal_sewa,data[0].harga_sewa)
            }
            response.json({
                data : responseData
            })
        }
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
    
}

const createNewRent = async (req,response)=> {
    const data = req.body;
    try {
        await rentModel.insertRent(data.id_barang,data.id_user,data.status,data.tanggal_sewa,data.tanggal_kembali).then(()=> {
            response.json({
                message: "Rent Success",
                data: req.body
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const deleteRent = async (req,response)=> {
    const {id} = req.params;
    try {
        await rentModel.deleteRent(id).then(()=> {
            response.json({
                message: 'Delete Rent Success',
                id_delete: id
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const updateRent = async (req,response) => {
    const {id} = req.params;
    const dataUpdate = req.body;
    try {
        await rentModel.updateRent(id,dataUpdate.status).then(()=> {
            response.json({
                message: 'Update Rent Success',
                id_updated: id,
                status_update: dataUpdate
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}



module.exports = {
    getRentPsAllUser,
    getRentSingle,
    createNewRent,
    deleteRent,
    updateRent
}