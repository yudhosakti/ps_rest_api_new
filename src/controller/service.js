const serviceModel = require('../models/service')
const serviceData = require('./data/service_data')
const globlFunction = require('./data/global_function')

const getAllGroup = async(req,response) => {
   const {id} = req.params;
   try {
    const [data] = await serviceModel.getAllGroupBySingleId(id)
    if (data.length == 0) {
        response.json({
            message: "Data Not Found"
        })
    } else {
     const dataFinal = serviceData.serviceProccesData(data)

    response.json({
        data: dataFinal
    })
    }
    
   } catch (error) {
      response.status(500).json({
        message: error
      })    
   }
}

const getAllMessageSingleGroup = async(req,response) => {
    const {id}  = req.params;
    try {
        const [data] = await serviceModel.getAllMessageSingleGroup(id)
        if (data.length == 0) {
            response.json({
                message: "Data Not Found"
            })
        } else {
            let dataFinal = []
            for (let index = 0; index < data.length; index++) {
                dataFinal.push({
                    id_chat: data[index].id_chat,
                    user: {
                        id_user: data[index].id_user,
                       name: data[index].name,
                       avatar: data[index].avatar,
                       role: data[index].role,
                    },
                    message: data[index].message,
                    send_at: globlFunction.formatTanggalPesan(data[index].send_at) 
                })
                
            }

            response.json({
                data: dataFinal
            })
        }
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

const createGroupChat = async(req,response) => {
    const dataInsert = req.body

    const newTime =  Date.now()

    console.log(globlFunction.formatMySQLTimestamp(newTime))
    
    try {
        await serviceModel.createGroup(globlFunction.formatMySQLTimestamp(newTime)).then(async()=> {
            const [dataGrup] = await serviceModel.getSingleGroup(globlFunction.formatMySQLTimestamp(newTime))
            if (dataGrup.length == 0) {
                throw response.status(500).json({
                    message: 'Interal Error'
                })
            } else {
                let dateNow = new Date() 
                await serviceModel.createMemberGroup(dataGrup[0].id_cs,dataInsert.id_receiver,dataInsert.id_sender,globlFunction.formatTanggal(dateNow)).then(async()=>{
                    const [dataMember] = await serviceModel.getSingleMember(dataGrup[0].id_cs,dataInsert.id_sender)
                    if (dataMember.length == 0) {
                        throw response.status(500).json({
                            message: 'Interal Error'
                        })
                    } else {
                        await serviceModel.createMessage(dataGrup[0].id_cs,dataMember[0].id_member,dataInsert.message,globlFunction.formatTanggalPesan(dateNow)).then(()=> {
                            response.json({
                                message: "Insert Success",
                                data: dataInsert
                            })
                        })
                    }
                    
                })
            }
        })
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

const createMessage= async(req,response) => {
    const dataInsert = req.body
    const newTime =  Date.now()
    try {
        await serviceModel.createMessage(dataInsert.id_cs,dataInsert.id_member,dataInsert.message,globlFunction.formatTanggalPesan(newTime)).then(()=> {
            response.json({
                message: "Message Send Success",
                data: dataInsert
            })
        })
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

const updateMessage = async(req,response) => {
    const {id} = req.params
    const dataInsert = req.body

    try {
        await serviceModel.updateMessage(id,dataInsert.message).then(()=> {
            response.json({
                message: "Message Update Success",
                data: {
                    id_chat: id,
                    message: dataInsert.message
                }
            })
        })
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

module.exports = {
    getAllGroup,
    getAllMessageSingleGroup,
    createGroupChat,
    createMessage,
    updateMessage
}