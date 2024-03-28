const testModel = require('../models/test');
const getAllItem = (req,response)=>{
    const dummyData = {
        id : '1',
        nama : "Halo dek",
        email : "yudho@gmail.com"
    }
    response.json({
        message: "Get All Item",
        data : dummyData
    })
}

const getFilterItemByType = (req,response) => {
    response.json({
        message: "Get Filter Item"
    })
}

const addItem = (req,response)=> {
    console.log(req.body);
    response.json({
        message: "Tambah Item",
        data: req.body
    })
}

const updateUser = (req,response)=> {
    const {id} = req.params;
    console.log('idItem : ', id);

    response.json({
        message: 'update item success',
        data: req.body
    })
}

const deleteItem = (req,response) => {
    const {id} = req.params;
    console.log(id);
    response.json({
        message : 'delete',
        data : {
            id : id,
            name : 'ps2'
        }
    })
}



module.exports = {
    getAllItem,
    getFilterItemByType,
    addItem,
    updateUser,
    deleteItem,
}