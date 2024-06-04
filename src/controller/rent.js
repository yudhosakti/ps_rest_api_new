const rentModel = require('../models/rent')
const itemModel = require('../models/item')
const globalFunction = require('./data/global_function')
const fetch = require('node-fetch');
const personModel = require('../models/person')
const { v4: uuidv4 } = require('uuid');


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
            order_id: data[index].id_transaksi,
            user: {
                id: data[index].id_user,
                name: data[index].name,
                avatar: data[index].avatar,
                email: data[index].email
            },
            date: {
                start: globalFunction.formatTanggal(data[index].tanggal_sewa),
                end: globalFunction.formatTanggal(data[index].tanggal_kembali)
            },
            status: data[index].status,
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
            response.status(404).json({
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
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            responseData = {
                id_sewa: data[0].id_sewa,
                order_id: data[0].id_transaksi,
            user: {
                id: data[0].id_user,
                name: data[0].name,
                avatar: data[0].avatar,
                email: data[0].email
            },
            date: {
                start: globalFunction.formatTanggal(data[0].tanggal_sewa),
                end: globalFunction.formatTanggal(data[0].tanggal_kembali)
            },
            status: data[0].status,
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


const updateRent = async (req,response) => {
    const data = req.body;
    try {
        const url = `https://api.sandbox.midtrans.com/v1/payment-links/${data.order_id}`;
        const audUrl = 'SB-Mid-server-ldx8Nh1i6hFDEBRbTmRmWUF6'
        const midtransServerKey = btoa(`${audUrl}:`)

        const options = {
            method: 'GET',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${midtransServerKey}`
        },
        }

        const fetchResponse = await fetch(url, options);
        const jsonResponse = await fetchResponse.json();
        let response_custom = []

        if (!fetchResponse.ok) {
            response.status(fetchResponse.status).json(jsonResponse);
        } else {
            response_custom.push({
                order_id: jsonResponse.order_id,
                payment_link_url: jsonResponse.payment_link_url,
                total_price: jsonResponse.locale_amount_with_prefix,
                status: jsonResponse.last_snap_transaction_status,
                tanggal_sewa: jsonResponse.custom_field1,
                tanggal_kembali: jsonResponse.custom_field2,
                customer: jsonResponse.customer_details,
                items: jsonResponse.item_details,
                purchase: jsonResponse.purchases
            })
            
            const [dataku] = await rentModel.getSingleRent(data.order_id)
            console.log(dataku) 
            if (dataku.length == 0) {
                response.status(404).json({
                    message: "Rent Not Found"
                })
            } else {
                if (response_custom[0].status == 'SETTLEMENT') {
                    await rentModel.updateRent(data.order_id,'approve').then(() => {
                        response.json({
                            message: "Update Rent Success",
                            status: "Approve",
                            data: req.body
                        })
                    })
                } else {
                    response.json({
                        message: "Cannot Update Payment Not Complete",
                        data: req.body
                    })
                }
            }
            
            
        }
        
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}


const getPaymentDetail = async(req,response) => {
    const dataInsert = req.body
    try {
        const url = `https://api.sandbox.midtrans.com/v1/payment-links/${dataInsert.order_id}`;
        const audUrl = 'SB-Mid-server-ldx8Nh1i6hFDEBRbTmRmWUF6'
        const midtransServerKey = btoa(`${audUrl}:`)

        const options = {
            method: 'GET',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${midtransServerKey}`
        },
        }

        const fetchResponse = await fetch(url, options);
        const jsonResponse = await fetchResponse.json();
        let response_custom = [];
        
        if (!fetchResponse.ok) {
            response.status(fetchResponse.status).json(jsonResponse);
        } else {
            response_custom.push({
                order_id: jsonResponse.order_id,
                payment_link_url: jsonResponse.payment_link_url,
                total_price: jsonResponse.locale_amount_with_prefix,
                status: jsonResponse.last_snap_transaction_status,
                tanggal_sewa: jsonResponse.custom_field1,
                tanggal_kembali: jsonResponse.custom_field2,
                customer: jsonResponse.customer_details,
                items: jsonResponse.item_details,
                purchase: jsonResponse.purchases
            })
            response.json({
                data: response_custom[0]
            });
        }
    } catch (error) {
        response.status(500).json({
            message: "Internal Error",
            err: error,
    
        })
    }

}



const createPaymentMultipleItem = async(req,response) => {
    const dataInsert = req.body

    try {
        let dataBarangFinal = []
        let message = ''
        Promise.all(dataInsert.data.map(async element => {
            console.log(element)
            try {
            const [data] = await itemModel.getSingleItem(element.id_item)
            dataBarangFinal.push({
                id: data[0].id_barang,
                name: data[0].nama_barang,
                harga: data[0].harga_sewa,
                quantity: element.quantity,
                total: data[0].harga_sewa * element.quantity * globalFunction.dayCalculated(dataInsert.tanggal_kembali,dataInsert.tanggal_sewa)
            })
            if (element.quantity > data[0].stock) {
                 message = 'error'
                }
                
            } catch (error) {
               message = 'error'
            }
           
        })).then(async()=> {
            if (message == 'error') {
                response.status(500).json({
                    message: 'Invalid Stock'
                })
            } else {
            let finalHarga = 0
            let finalItem = []
            const [dataUser] = await personModel.getSingleUser(dataInsert.id_user)
            if (dataUser.length == 0) {
                response.status(404).json({
                    message: "User Not Found"
                })
            } else {
                console.log(dataBarangFinal)
                for (let index = 0; index < dataBarangFinal.length; index++) {
                    finalHarga+=dataBarangFinal[index].total
                    finalItem.push({
                        name: dataBarangFinal[index].name,
                       price : dataBarangFinal[index].harga *globalFunction.dayCalculated(dataInsert.tanggal_kembali,dataInsert.tanggal_sewa) ,
                       quantity: dataBarangFinal[index].quantity,
                       brand: `${dataBarangFinal[index].id}`
                    })
                    
                }
               const trId = `RC-${uuidv4().replace(/-/g, '').substring(0, 12)}`
            
            const url = 'https://api.sandbox.midtrans.com/v1/payment-links';
            const audUrl = 'SB-Mid-server-ldx8Nh1i6hFDEBRbTmRmWUF6'
            const midtransServerKey = btoa(`${audUrl}:`)
          
            const options = {
                method: 'POST',
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${midtransServerKey}`
            },
            body: JSON.stringify({
                transaction_details: {order_id: trId, gross_amount: finalHarga},
                item_details: finalItem,
                customer_details :{
                user_id: dataUser[0].id_user,
                first_name: dataUser[0].name,
                email: dataUser[0].email
                },
                custom_field1: globalFunction.formatTanggal(dataInsert.tanggal_sewa),
                custom_field2:globalFunction.formatTanggal(dataInsert.tanggal_kembali)
            })
            }
            const fetchResponse = await fetch(url, options);
            const jsonResponse = await fetchResponse.json();
    
            await rentModel.createRentNewMultiple(dataUser[0].id_user,jsonResponse.order_id,globalFunction.formatTanggal(dataInsert.tanggal_sewa),globalFunction.formatTanggal(dataInsert.tanggal_kembali)).then(async()=>{
                const [data] = await rentModel.getSingleRent(jsonResponse.order_id)
                if (data.length == 0) {
                    response.status(404).json({
                        message: "Terjadi Kesalahan"
                    })
                } else {
                    Promise.all(dataBarangFinal.map(async(element) => {
                        await rentModel.createItemRentMultiple(element.id,data[0].id_sewa,element.quantity)
                   })).then(()=> {
                      response.json({
                        message: "Create Rent Success Please Go to Payment Link To Complete Your Order",
                        data: {
                            order_id: jsonResponse.order_id,
                            payment_link: jsonResponse.payment_url,
                            id_user: dataUser[0].id_user,
                            items: finalItem

                        }
                      })
                   })
                }
                
            })
            

        }
            }
            
        })
       
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
    
}

const deleteRentMultipleItem = async(req,response) => {
    const dataInsert = req.body
    try {
        const [data] = await rentModel.getAllItemRentByOrderId(dataInsert.order_id)

        Promise.all(data.map(async(element) => {
            await rentModel.deleteItemRentById(element.id_bs)
        })).then(async()=> {
            await rentModel.deleteRent(data[0].id_sewa).then(()=>{
                response.json({
                    message: "Rent Deletion Success"
                })
            })
        })
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}






module.exports = {
    getRentPsAllUser,
    getRentSingle,
    updateRent,
    getPaymentDetail,
    createPaymentMultipleItem,
    deleteRentMultipleItem
}