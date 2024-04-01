const forumModel = require('../models/forum')

const getAllForum = async(req,response)=> {
    const {page} = req.params;
    try {
        const [data] = await forumModel.getAllForum();
        let dataFinal = [];
        let dataTemp = [];

        for (let index = 0; index < data.length; index++) {
            dataTemp.push(data[index]);
            if (dataTemp.length == 25 || index+1 >= data.length) {
                dataFinal.push(dataTemp);
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
        } else {
            if (parseInt(page) <=0 || parseInt(page)> dataFinal.length || !Number.isInteger(parseInt(page))) {
                response.json({
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
        response.json({
            message: error
        })
    }
   
}

const getSingleForum = async(req,response)=> {
    const {id} = req.params;
    try {
        const [data] = await forumModel.getSingleForum(id);
        response.json({
            data: data[0]
        })
    } catch (error) {
        response.json({
            message: error
        })
    }
}

const addForum = async(req,response)=> {
    const dataInsert = req.body;
    try {
        await forumModel.addForum(dataInsert.image,dataInsert.name,dataInsert.deskripsi,dataInsert.create_at).then(()=> {
            response.json({
                message: 'Create Forum Success',
                data: dataInsert
            })
        })
    } catch (error) {
        response.json({
            message: error
        })
    }
}
const updateForum = async(req,response)=> {
    const {id} = req.params;
    const dataInsert = req.body;
    try {
        await forumModel.updateForum(id,dataInsert.image,dataInsert.name,dataInsert.deskripsi).then(()=> {
            response.json({
                message: ' Update Forum Success',
                data: dataInsert
            })
        })
    } catch (error) {
        response.json({
            message: error
        })
    }
}
const deleteForum = async(req,response)=> {
    const {id} = req.params;
    try {
        await forumModel.deleteForum(id).then(()=> {
            response.json({
                message: 'Delete Forum Success',
                id_deleted: id
            })
        })
    } catch (error) {
        response.json({
            message: error
        })
    }
}

module.exports= {
    getAllForum,
    getSingleForum,
    addForum,
    updateForum,
    deleteForum
}
