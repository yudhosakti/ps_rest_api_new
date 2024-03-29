const rentModel = require('../models/rent')

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
            id_barang: data[index].id_barang,
            id_user: data[index].id_user,
            name: data[index].name,
            email: data[index].email,
            item: data[index].nama_barang,
            tanggal_sewa: data[index].tanggal_sewa,
            tanggal_kembali: data[index].tanggal_kembali,
            harga: Math.abs(data[index].tanggal_kembali - data[index].tanggal_sewa) * data[index].harga_sewa
        })
        if (dataResponse.length == 2 || index+1 >= data.length) {
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
        if (page <= 0 || page> dataResponseFinal.length) {
            response.status(500).json({
                message: "Data Not Found"
            })
        }else{
            response.json({
                paginate: ({
                    max_page : dataResponseFinal.length,
                    current_page : page,
                    total_item_page : dataResponseFinal[page-1].length
                }),
                data: dataResponseFinal[page-1]
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
            id_barang: data[0].id_barang,
            id_user: data[0].id_user,
            name: data[0].name,
            email: data[0].email,
            item: data[0].nama_barang,
            tanggal_sewa: data[0].tanggal_sewa,
            tanggal_kembali: data[0].tanggal_kembali,
            harga: Math.abs(data[0].tanggal_kembali - data[0].tanggal_sewa) * data[0].harga_sewa
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



module.exports = {
    getRentPsAllUser,
    getRentSingle
}