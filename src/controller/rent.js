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
            console.log(response_custom)
            if (response_custom[0].status == 'SETTLEMENT') {
                await rentModel.insertRent(parseInt(response_custom[0].items[0].brand),parseInt(response_custom[0].customer.user_id),response_custom[0].order_id,'approve',response_custom[0].tanggal_sewa,response_custom[0].tanggal_kembali).then(()=> {
                    response.json({
                        message: "Rent Success",
                        data: req.body
                    })
                })
            } else {
                await rentModel.insertRent(parseInt(response_custom[0].items[0].brand),parseInt(response_custom[0].customer.user_id),response_custom[0].order_id,'pending',response_custom[0].tanggal_sewa,response_custom[0].tanggal_kembali).then(()=> {
                    response.json({
                        message: "Rent Success But Pay Still Pending",
                        data: req.body
                    })
                })
            }
            
        }
        
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
    const data = req.body;
    const {id} = req.params;
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
            console.log(response_custom)
            if (response_custom[0].status == 'SETTLEMENT') {
                await rentModel.updateRent(id,'approve').then(() => {
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
        
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}

const getPaymentLink = async(req,response) => {
   const dataInsert = req.body
   try {
      const [data] = await itemModel.getSingleItem(dataInsert.id_barang)
      const [user] = await personModel.getSingleUser(dataInsert.id_user)
      if (data.length == 0 || user.length == 0) {
        response.status(404).json({
            message: "Barang Tidak Ada Atau User Tidak Ada",
    
        })
      } else {
        const price = globalFunction.rentPriceCalculate(dataInsert.tanggal_kembali,dataInsert.tanggal_sewa,data[0].harga_sewa)
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
            transaction_details: {order_id: trId, gross_amount: price},
            item_details: [
                {
                   id: `${data[0].id_barang}`,
                   name: data[0].nama_barang,
                   price : price,
                   quantity: 1,
                   brand: `${data[0].id_barang}`

                },
            ],
            customer_details :{
            user_id: user[0].id_user,
            first_name: user[0].name,
            email: user[0].email
            },
            custom_field1: globalFunction.formatTanggal(dataInsert.tanggal_sewa),
            custom_field2:globalFunction.formatTanggal(dataInsert.tanggal_kembali)
        })
        };

       fetch(url,options)
         .then(res => res.json())
         .then(json => {
            response.json(json)
         })
         .catch(err => console.error('error:' + err));
      }
    
   } catch (error) {
    response.status(500).json({
        message: "Internal Error",
        err: error,

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







module.exports = {
    getRentPsAllUser,
    getRentSingle,
    createNewRent,
    deleteRent,
    updateRent,
    getPaymentLink,
    getPaymentDetail
}