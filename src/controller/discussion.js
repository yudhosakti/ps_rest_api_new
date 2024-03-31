const discussionModel = require('../models/discussion');

const getAllChatById =async (req,response)=> {
    const {id} = req.params;
    try {
    const [data] = await discussionModel.getAllChatById(id);
    let dataCustomFinal = [];

    for (let index = 0; index < data.length; index++) {
         dataCustomFinal.push({
            id_chat: data[index].id_chat,
            id_user: data[index].id_user,
           nama_user: data[index].name,
           message:data[index].message,
           send_at:data[index].send_at
         })
        
    }

    if (data.length == 0) {
        response.json({
            message: 'Empty Data Chat',
            data: data
        })
    } else {
        response.json({
            data: dataCustomFinal
        })
    }

    } catch (error) {
        response.status(500).json({
            message : error
        })  
    }
}

const addChat = async(req,response)=> {
    const dataInsert = req.body;
    try {
        await discussionModel.addChat(dataInsert.id_user,dataInsert.id_forum,dataInsert.message).then(()=> {
            response.json({
                message: 'Send Message Success',
                data: dataInsert
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        })  
    }
}

const updateChat = async(req,response)=> {
    const dataInsert = req.body;
    const {id} = req.params;
    try {
        await discussionModel.updateChat(id,dataInsert.message,dataInsert.send_at).then(()=> {
            response.json({
                message: 'Update Message Success',
                data: dataInsert
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }
}

const deleteChat = async(req,response)=> {
    const {id} = req.params;
    try {
        await discussionModel.deleteChat(id).then(()=> {
            response.json({
                message: 'Delete Message Success',
                id_deleted: id
            })
        })
    } catch (error) {
        response.status(500).json({
            message : error
        })
    }
}

module.exports = {
    getAllChatById,
    addChat,
    updateChat,
    deleteChat
}