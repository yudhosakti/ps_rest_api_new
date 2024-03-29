const itemModel = require('../models/item');

const getAllItem = async(req,response)=>{
    try {
    const [data] = await itemModel.getAllItem();
    response.json({
    data: data
     })
    } catch (error) {
        response.status(500).json({
            message : error
        })    
    }
   
}

const getSingleItem = async(req,response)=> {
    try {
    const {id} = req.params;
    const [data] = await itemModel.getSingleItem(id);
    if (data.length == 0) {
        response.json({
            data: "Item not Found"
        }) 
    } else {
        response.json({
            data: data[0]
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
    try {
      await itemModel.createItem(dataInsert.name,dataInsert.image,dataInsert.tipe,dataInsert.deskripsi,dataInsert.stock,dataInsert.harga).then(()=> {
        response.json({
            message: 'Data Inserted',
            data: dataInsert
        })
      })
    } catch (error) {
        response.status(500).json({
            message : error
        })   
    }
}

const deleteItem = async(req,response) => {
    const {id} = req.params;
    try {
        await itemModel.deleteItem(id).then(()=> {
            response.json({
                message: 'Delete Item Success',
                id_deleted: id
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        }) 
    }
}






// const getFilterItemByType = (req,response) => {
//     response.json({
//         message: "Get Filter Item"
//     })
// }

// const addItem = (req,response)=> {
//     console.log(req.body);
//     response.json({
//         message: "Tambah Item",
//         data: req.body
//     })
// }

// const updateUser = (req,response)=> {
//     const {id} = req.params;
//     console.log('idItem : ', id);

//     response.json({
//         message: 'update item success',
//         data: req.body
//     })
// }

// const deleteItem = (req,response) => {
//     const {id} = req.params;
//     console.log(id);
//     response.json({
//         message : 'delete',
//         data : {
//             id : id,
//             name : 'ps2'
//         }
//     })
// }



module.exports = {
    getAllItem,
    getSingleItem,
    createItem,
    deleteItem
}