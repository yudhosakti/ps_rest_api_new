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

const getCustomResponse = async (req,res)=>{
    try {
        const [data] = await testModel.getCustomResponse();
    let dataCustom = [];
    let tempJson = [];
    let tempnum = [];
    for (let index = 0; index < data.length; index++) {
        let dataId = data[index].id_test
        if (!tempnum.includes(data[index].id_test)) {
                   tempnum.push(data[index].id_test)
                      for (let index = 0; index < data.length; index++) {
                          if (data[index].id_test == dataId) {
                             tempJson.push({
                                id_hobi: data[index].id_tescase,
                                hobi: data[index].hobi
                             })
                          }
                        
                      }
                      dataCustom.push({
                       id: data[index].id_test,
                       nama: data[index].nama,
                       hobi: tempJson
                   })
                   tempJson = [];
                }
                 
            }
            res.json({
                data: dataCustom
            })
    } catch (error) {
        res.status(500).json({
            error : "server error",
            message: error
        })
    }
    
    

}

module.exports = {
    getAllItem,
    getFilterItemByType,
    addItem,
    updateUser,
    deleteItem,
    getCustomResponse
}